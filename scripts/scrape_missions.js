// Get the first table on the page
const table = document.querySelector('table');

// Get all table rows (excluding the header row)
const rows = table.querySelectorAll('tbody tr');

// Initialize an array to store the scraped data
let data = [];

// Loop through each row, skip the header row
rows.forEach((row, index) => {
  if (index > 0) {  // Skip the first row (header)
    // Get all columns (td) in the current row
    const cols = row.querySelectorAll('th');

    // Check if the row has the expected number of columns
    if (cols.length === 9) {
      // Extract the href and text of the <a> tags in the hints columns
      const hintsEnabled = Array.from(cols[6].querySelectorAll('a')).map(a => ({
        href: a.href,
        name: a.innerText
      }));

      const hintsFree = Array.from(cols[7].querySelectorAll('a')).map(a => ({
        href: a.href,
        name: a.innerText
      }));

      const hintsDisabled = Array.from(cols[8].querySelectorAll('a')).map(a => ({
        href: a.href,
        name: a.innerText
      }));

      // Push the data for this row
      data.push({
        alias: cols[0].innerText,
        mission: cols[1].innerText,
        type: cols[2].innerText,
        difficulty: cols[3].innerText,
        category: cols[4].innerText,
        subcategory: cols[5].innerText,
        hintsEnabled: hintsEnabled,
        hintsFree: hintsFree,
        hintsDisabled: hintsDisabled
      });
    }
  }
});

// Log the scraped data to the console
console.log(data);

// Optionally, you can convert it into JSON for easier manipulation
const jsonData = JSON.stringify(data, null, 2);
console.log(jsonData);
