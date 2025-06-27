// Figma Plugin Main Code
// This runs in the Figma plugin sandbox

// Show the plugin UI with external URL
figma.showUI("https://banner-automation-rnv1u5fop-seokhkangs-projects.vercel.app/figma", { 
  width: 480, 
  height: 640,
  themeColors: true 
});

// Handle messages from UI
figma.ui.onmessage = function(msg) {
  console.log('Received message:', msg);

  if (msg.type === 'get-selection') {
    handleGetSelection();
  } else if (msg.type === 'get-page-data') {
    handleGetPageData();
  } else if (msg.type === 'create-banner') {
    handleCreateBanner(msg.data);
  } else if (msg.type === 'export-design') {
    handleExportDesign(msg.data);
  } else if (msg.type === 'close-plugin') {
    figma.closePlugin();
  } else {
    console.log('Unknown message type:', msg.type);
  }
};

// Get selected elements
function handleGetSelection() {
  var selection = figma.currentPage.selection;
  var selectionData = [];
  
  for (var i = 0; i < selection.length; i++) {
    var node = selection[i];
    selectionData.push({
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
      fills: node.fills || [],
      effects: node.effects || []
    });
  }

  figma.ui.postMessage({
    type: 'selection-data',
    data: selectionData
  });
}

// Get current page data
function handleGetPageData() {
  var page = figma.currentPage;
  var children = [];
  
  for (var i = 0; i < page.children.length; i++) {
    var node = page.children[i];
    children.push({
      id: node.id,
      name: node.name,
      type: node.type,
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height
    });
  }
  
  var pageData = {
    id: page.id,
    name: page.name,
    children: children
  };

  figma.ui.postMessage({
    type: 'page-data',
    data: pageData
  });
}

// Create banner from template
function handleCreateBanner(data) {
  try {
    // Create a new frame for the banner
    var frame = figma.createFrame();
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
      figma.loadFontAsync({ family: "Inter", style: "Regular" }).then(function() {
        var textNode = figma.createText();
        textNode.characters = data.text;
        textNode.fontSize = data.fontSize || 24;
        textNode.x = data.textX || 50;
        textNode.y = data.textY || 50;
        frame.appendChild(textNode);
        
        // Select the created frame
        figma.currentPage.selection = [frame];
        figma.viewport.scrollAndZoomIntoView([frame]);
        
        figma.ui.postMessage({
          type: 'banner-created',
          data: { id: frame.id, name: frame.name }
        });
      }).catch(function(error) {
        console.error('Error loading font:', error);
        figma.ui.postMessage({
          type: 'error',
          message: 'Failed to load font: ' + error.message
        });
      });
    } else {
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
    }
    
  } catch (error) {
    console.error('Error creating banner:', error);
    figma.ui.postMessage({
      type: 'error',
      message: 'Failed to create banner: ' + error.message
    });
  }
}

// Export design data
function handleExportDesign(options) {
  try {
    var selection = figma.currentPage.selection;
    if (selection.length === 0) {
      throw new Error('No elements selected');
    }
    
    var exportData = [];
    var completed = 0;
    var total = selection.length;
    
    function processNode(index) {
      if (index >= total) {
        figma.ui.postMessage({
          type: 'export-complete',
          data: exportData
        });
        return;
      }
      
      var node = selection[index];
      
      // Export as image if requested
      if (options.includeImages && (node.type === 'FRAME' || node.type === 'COMPONENT')) {
        node.exportAsync({
          format: 'PNG',
          constraint: { type: 'SCALE', value: options.scale || 1 }
        }).then(function(imageBytes) {
          // Convert to base64
          var base64 = figma.base64Encode(imageBytes);
          
          exportData.push({
            id: node.id,
            name: node.name,
            type: node.type,
            image: 'data:image/png;base64,' + base64,
            properties: {
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
              fills: node.fills || [],
              effects: node.effects || []
            }
          });
          
          processNode(index + 1);
        }).catch(function(error) {
          console.error('Error exporting image:', error);
          exportData.push({
            id: node.id,
            name: node.name,
            type: node.type,
            error: error.message,
            properties: {
              x: node.x,
              y: node.y,
              width: node.width,
              height: node.height,
              fills: node.fills || [],
              effects: node.effects || []
            }
          });
          processNode(index + 1);
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
            fills: node.fills || [],
            effects: node.effects || []
          }
        });
        processNode(index + 1);
      }
    }
    
    processNode(0);
    
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