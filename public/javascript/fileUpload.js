FilePond.registerPlugin(
    FilePondPluginImagePreview, 
    FilePondPluginImageResize, 
    FilePondPluginFileEncode, 
);

FilePond.setOptions({
    stylePanelAspectRatio: 150/100, 
    imageResizeTargetWidth: 100, 
    imageResizeTargetHeight: 150
})

// turn file input elements into ponds
FilePond.parse(document.body);