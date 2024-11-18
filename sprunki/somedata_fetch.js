async function fetchAndMergeScripts() {
  // Fetch each JS file
  const response1 = await fetch("https://cdn.jsdelivr.net/gh/beak2825/special-bassoon@main/sprunki/somedata1.js");
  const response1_2 = await fetch("https://cdn.jsdelivr.net/gh/beak2825/special-bassoon@main/sprunki/somedata1_2.js");
  const response2 = await fetch("https://cdn.jsdelivr.net/gh/beak2825/special-bassoon@main/sprunki/somedata2.js");
  const response3 = await fetch("https://cdn.jsdelivr.net/gh/beak2825/special-bassoon@main/sprunki/somedata3.js");

  // Wait for all files to load
  const data1 = await response1.text();
  const data1_2 = await response1_2.text();
  const data2 = await response2.text();
  const data3 = await response3.text();

  // Merge the scripts (concatenate their contents)
  const mergedScript = data1 + data1_2 + data2 + data3;

  // Create a new script tag and add the merged content
  const scriptTag = document.createElement("script");
  scriptTag.textContent = mergedScript;
  document.body.appendChild(scriptTag); // Append to the body (or head)
}

// Call the function to fetch and merge
fetchAndMergeScripts();
