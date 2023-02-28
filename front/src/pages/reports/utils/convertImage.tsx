import Plotly from "plotly.js";

export interface image {
    name: string,
    componentKey: string
}

export function convertImageToURI(imageTag: any): any {
     // Select the image
     const img = document.querySelector(imageTag);
     img.addEventListener('load', function (event) {
        const dataUrl = getDataUrl(event.currentTarget);
        return `<img src="${dataUrl}" o:title="">`;
     });
}

function getDataUrl(img) {
    // Create canvas
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    // Set width and height
    canvas.width = img.width;
    canvas.height = img.height;
    // Draw the image
    ctx.drawImage(img, 0, 0);
    return canvas.toDataURL('image/jpeg');
 }

export async function convertPlotlyToURI(plotlyTag: any, Width: number): Promise<string> {
    try{var graphDiv = document.getElementById(plotlyTag);
        var imgOpts: Plotly.ToImgopts = {format: 'jpeg', height: Width*.6, width: Width};
        let myImage = await Plotly.toImage(graphDiv,imgOpts);
        return `<img src="${myImage}" alt="">`; 
    }catch{
        return `<p>[${plotlyTag} Image Not Available]</p>`;
    }
}
