

## **US Population API Extrapulator Deluxe**

  

**INSTALLATION**

To run this application, download, and extract to a folder. Open *report.htm* in a browser to view a 100% dynamic report that is rendered from a highly processed version of the source data from the API.

  

Open data.htm to download a CSV of the API source data. When opening the page, a csv with a unique identifier is automatically generated and downloaded.

  

This code makes use of CDN libraries (in an effort to minimize footprint), so an internet connection is required to run. In the rare event that a vpn/proxy prevents accessing a CDN reference, you will need to retry from a machine that has an unobstructed internet connection. Where possible, CDN references use SRI hashes to ensure security.

  

This has been tested in Firefox, Chrome, and Edge in a windows environment, and Safari, Edge, and Chrome in MacOS.

  
  

**CODE OVERVIEW**

This code is pure HTML, CSS, and Javascript.

  

The logic for making an HTTP GET connection with the API, consuming the payload, transforming the source data is in */scripts/module_data.js*. In addition to meeting the requirements for the CSV output, it calculates other aggregate data and extrapolates additional values that is used in report generation.

  

*/data.htm* is just a HTML wrapper to call the data module to export CSV data.

  

*/report.htm* is responsible for rendering the report. Leveraging the data module to get the transformed data, it further massages, slices, and dices these numbers.

 The interactive data grid uses the js-grid library.

The interactive plot uses the chart.js library.

The interactive map uses the leaflet.js library, and reuses a sample code from an interactive choropleth map boilerplate example supplied by the makers of the library (https://leafletjs.com/examples/choropleth/). I made changes to read populate deltas instead of population density and expanded legend coloring and resolution to better suit the dataset. */scripts/stategeo.js* contains coordinate data needed to draw state line boundaries.

Misc JS libraries (bootstrap, jquery, fontawesome) are used for formatting the report and making things more or less visually pleasing.

**REQUIREMENTS TRACEABILITY**

 1. *"Given the API link above, return a CSV with the data and a report that can be presented to a wide audience with the findings."*
**API is consumed in module_data.js, with a method that will return a csv string (with values properly escaped), that feeds to an HTML page that triggers a download of the data.  Findings are extrapolated in report for presentation in an accessible, interactive manner to a varied audience.**
2. *"The CSV must be generated via code but the report can be created by hand or programmatically in any software you prefer (e.g. PowerPoint, Excel, PDF, etc)."*
**CSV output is entirely generated in java cript. Report is rendered 100% programmatically in a browser.**
3.  "The CSV should show per-state population change year-over-year, as well as the prime factorization of the final year's population. Population change should be represented as raw values and percentages in parentheses. Prime factors should be separated by semicolons."
**The code follows the prescribed format, and can accomodate changes in # of years in the event that the data is updated in subsequent years.**
4. *"The content of the report can be any part of the dataset given. The report will be evaluated biased on appearance, organization, and support from the dataset. The presentation should take roughly ten minutes to complete."*
**The entirety of the data represented in the CSV output is used as content for the report with the exception of the prime factorizations.  I could not find any practical use for these numbers in regards to dealing with population data.**
5. "*The solution must be able to run on the interviewer’s machine at the time of the interview.*"
**The solution has been tested in several environments and runs without the installation of any specific binaries, and functions the same on different browsers. A README.MD file has been provided.**
6. *"All solutions must be submitted with a public facing git repository"*
**The solution is available here: https://github.com/DosGuru/popreport** 
7. *"All data processing from the API and into the CSV must be in code"*
**The data module uses a XMLHttpRequest to perform an HTTP GET against the API.  All CSV processing is done dynamically in pure javascript. Major libraries used are mentioned above.**


