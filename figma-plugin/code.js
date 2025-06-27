// Figma Plugin Main Code
// This runs in the Figma plugin sandbox

// Show the plugin UI (URL is set in manifest.json)
figma.showUI("", { 
  width: 480, 
  height: 640,
  themeColors: true 
});

// Handle messages from UI
figma.ui.onmessage = async (msg) => {
  console.log('Received message:', msg);

  switch (msg.type) {
    case 'get-selection':
      handleGetSelection();
      break;
    
    case 'get-page-data':
      handleGetPageData();
      break;
    
    case 'create-banner':
      await handleCreateBanner(msg.data);
      break;
    
    case 'export-design':
      await handleExportDesign(msg.data);
      break;
    
    case 'close-plugin':
      figma.closePlugin();
      break;
    
    default:
      console.log('Unknown message type:', msg.type);
  }
};

// Get selected elements
function handleGetSelection() {
  const selection = figma.currentPage.selection;
  const selectionData = selection.map(node => ({
    id: node.id,
    name: node.name,
    type: node.type,
    x: node.x,
    y: node.y,
    width: node.width,
    height: node.height,
    // Add more properties as needed
    fills: node.fills,
    effects: node.effects
  }));

  figma.ui.postMessage({
    type: 'selection-data',
    data: selectionData
  });
}

// Get current page data
function handleGetPageData() {
  const page = figma.currentPage;
  const pageData = {
    id: page.id,
    name: page.name,
    children: page.children.map(node => ({
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    }))
  };

  figma.ui.postMessage({
    type: 'page-data',
    data: pageData
  });
}

// Create banner from template
async function handleCreateBanner(data) {
  try {
    // Create a new frame for the banner
    const frame = figma.createFrame();
    frame.name = data.name || 'Generated Banner';
    frame.resize(data.width || 800, data.height || 400);
    
    // Set background color
    if (data.backgroundColor) {
      frame.fills = [{
        type: 'SOLID',
        color: data.backgroundColor
      }];
    }
    
    // Add text if provided
    if (data.text) {
      const textNode = figma.createText();
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
      textNode.characters = data.text;
      textNode.fontSize = data.fontSize || 24;
      textNode.x = data.textX || 50;
      textNode.y = data.textY || 50;
      frame.appendChild(textNode);
    }
    
    // Center the frame
    frame.x = 0;
    frame.y = 0;
    
    // Select the created frame
    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);
    
    figma.ui.postMessage({
      type: 'banner-created',
      data: { id: frame.id, name: frame.name }
    });
    
  } catch (error) {
    console.error('Error creating banner:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'Failed to create banner: ' + error.message
    });
  }
}

// Export design data
async function handleExportDesign(options) {
  try {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      throw new Error('No elements selected');
    }
    
    const exportData = [];
    
    for (const node of selection) {
      // Export as image if requested
      if (options.includeImages && (node.type === 'FRAME' || node.type === 'COMPONENT')) {
        const imageBytes = await node.exportAsync({
          format: 'PNG',
          constraint: { type: 'SCALE', value: options.scale || 1 }
        });
        
        // Convert to base64
        const base64 = figma.base64Encode(imageBytes);
        
        exportData.push({
          id: node.id,
          name: node.name,
          type: node.type,
          image: `data:image/png;base64,${base64}`,
          properties: {
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
            fills: node.fills,
            effects: node.effects
          }
        });
      } else {
        exportData.push({
          id: node.id,
          name: node.name,
          type: node.type,
          properties: {
            x: node.x,
            y: node.y,
            width: node.width,
            height: node.height,
            fills: node.fills,
            effects: node.effects
          }
        });
      }
    }
    
    figma.ui.postMessage({
      type: 'export-complete',
      data: exportData
    });
    
  } catch (error) {
    console.error('Error exporting design:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'Failed to export design: ' + error.message
    });
  }
}

// Initialize plugin
console.log('Banner Automation Plugin loaded!'); 