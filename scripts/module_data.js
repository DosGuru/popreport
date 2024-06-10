const DataModule = (() => {
    console.log("Data Module loaded");
    let sourceData = [];
    let transformedData = [];
    let totalData = {};
    let minYear = 3000;
    let maxYear = 0;
    //this function transforms the source data into a secondary format that supports our uses
    const transformData = (data) =>{
        let dataset = [];
        //aggregate the data and compute min and max years
        data.forEach(x=>{
            if(x.Year > maxYear) {
                maxYear = x.Year;
            }
            if(x.Year < minYear) {
                minYear = x.Year;
            }
            let state = dataset.filter(y=>y.state==x.State);
            if(state.length==0) {
                let entry = {};
                entry.state = x.State;
                entry[x.Year] = x.Population;
                dataset.push(entry);
            } else {
                let entry = state[0];
                entry[x.Year] = x.Population;
            }
        });
        // transform annual data
        dataset.forEach(x=>{
            for(let i = +minYear+1; i <= +maxYear; i++) {
                let currentPop = x[i];
                let prevPop = x[+i-1];
                let diff = currentPop - prevPop;
                let change = (diff / prevPop) * 100;
                x[i + " diff"] = diff;
                x[i + " rawchange"] = +change.toFixed(2);
                x[i + " change"] = `(${change.toFixed(2)}%)`;
            }
            x[maxYear + " Factors"] = getPrimeFactors(x[maxYear]).join(';');
            x.totalDiff = (x[maxYear] - x[minYear]);
            x.totalChange = ((x.totalDiff / x[minYear]) * 100).toFixed(2);
        });
        // calculate total data
        totalData[minYear] = dataset.reduce((acc, item) => acc + item[minYear], 0);
        for (let i = +minYear+1; i <= +maxYear; i++) {
            totalData[i] = dataset.reduce((acc, item) => acc + item[i], 0)
            let currentPop = totalData[i];
            let prevPop = totalData[+i-1];
            let diff = currentPop - prevPop;
            let change = (diff / prevPop) * 100;
            totalData[i + " rawchange"] = +change.toFixed(2);
        }
        let transformedOutput = {};
        transformedOutput.dataset = dataset;
        transformedOutput.aggregate = totalData;
        transformedOutput.minYear = minYear;
        transformedOutput.maxYear = maxYear
        return transformedOutput;
    }
    //this function performs an HTTPGET against the API URL and returns the data as JSON, then sends it off for transformation
    const getData = () => {
        let url = "https://datausa.io/api/data?drilldowns=State&measures=Population";
        let sourceData, transformedData;
        try {
            const xhr = new XMLHttpRequest();
            xhr.open("GET", url, false); 
            xhr.send();
            if (xhr.status === 200) {
                const response = xhr.responseText;
                const data = JSON.parse(response);
                sourceData = data;
                transformedData = transformData(data.data);
                return transformedData;
            } else {
                throw new Error('Network Error ' + xhr.statusText);
            }
        } catch (error) {
            console.error('Error connection to API', error);
            return [];
        }
    }
    //this function calculates prime factors for a given value
    const getPrimeFactors = (value) =>{
        if(!value || value <=1) {
            return '';
        }
        let primeFactors = [];

        for (let divisor = 2; value >= 2; divisor++) {
            while (value % divisor === 0) {
                primeFactors.push(divisor);
                value /= divisor
            }
        }        
        return primeFactors;
    }
    //this function converts data to CSV format
    const getCsv = () => {
        let csv = [];
        if(!transformedData.dataset) {
            transformedData = getData();
        }
        let header= [];
        header.push("State Name");
        header.push(minYear);
        for(let i = +minYear+1; i <= +maxYear; i++) {
            header.push(i);
        }
        header.push(maxYear + " Factors");
        csv.push(header);
        transformedData.dataset.forEach(x=>{
            let row = [];
            row.push(x.state);
            row.push(x[minYear]);
            for(let i = +minYear+1; i <= +maxYear; i++) {
                row.push(x[i] + ' ' + x[i + " change"]);
            }
            row.push(x[maxYear + " Factors"]);
            csv.push(row);
        });
        let csvOutput = csv.map(row=>{
            return Object.values(row).map(escapeCsv).join(',');
        })
        return(csvOutput.join('\n'));
    }
    //this function escapes values for inclusion in CSV
    const escapeCsv = (value) => {
        if(value) {
            value = value.toString();
            value = value.replace(/"/g, '""');
            if (value.includes(',') || value.includes('\n') || value.includes('"')) {
                value = `"${value}"`;
            }
        }
        return value;
    }
return {
    getData, getPrimeFactors, getCsv
};
})();