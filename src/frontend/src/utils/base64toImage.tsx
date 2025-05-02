/** 
 * Converts a raw url string to a shareable image file to be used by a device
 * 
 * @param base64 string containing raw url of generated image
 * @param filename desired name of the output file
 * @param mimeType desired image file format
 * 
 * @return a file which contains the converted image in the correct format
*/

export function base64toFile(base64: string, filename: string, mimeType: string) {
    //Remove the data URL prefix
    const base64Data = base64.replace(/^data:\w+\/\w+;base64,/, "");
  
    //Convert the base64 string to binary data
    const binaryData = atob(base64Data);
  
    //Create an ArrayBuffer from the binary data
    const arrayBuffer = new ArrayBuffer(binaryData.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < binaryData.length; i++) {
      uint8Array[i] = binaryData.charCodeAt(i);
    }
  
    //Create a Blob object from the ArrayBuffer
    const blob = new Blob([arrayBuffer], { type: mimeType });
  
    //Create a File object from the Blob
    const file = new File([blob], filename, { type: mimeType });
  
    return file;
}