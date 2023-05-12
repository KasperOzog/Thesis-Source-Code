// MAEC Visualizer Color Map Configuration

// Color Map Format -> { tag: "", color: "" },
// Simply add another line into the COLOR_MAP array and changes will be reflected upon the node when the graph is rendered again.

const COLOR_MAP = [
    { tag: "maecPackage:MAEC_Package", color: "#ff0000" },
    { tag: "maecPackage:Malware_Subjects", color: "#ff4000" },
    { tag: "maecPackage:Malware_Subject", color: "#ff6600" },
    { tag: "maecPackage:Malware_Instance_Object_Attributes", color: "#ff9d00" },
    { tag: "cybox:Properties", color: "#ffc400" },
    { tag: "FileObj:Size_In_Bytes", color: "#fff700" },
    { tag: "FileObj:Hashes", color: "#fff700" },
    { tag: "WinRegistryKeyObj:Key", color: "#ff70f4" },
    { tag: "APIObj:Address", color: "#02ff05" },
    { tag: "cyboxCommon:Simple_Hash_Value", color: "#0000ff"},
  ];
  
  // false  = Fully collapsed after upload. Manual exploration begins with root node.
  
  const INITIALLY_EXPANDED = false;
  
