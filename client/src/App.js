import React, { useEffect, useState } from 'react';

// Define checklist rules
const checklistRules = [
  { name: 'Valuation Fee Paid', check: (data) => data.isValuationFeePaid === true },
  { name: 'UK Resident', check: (data) => data.isUkResident === true },
  { name: 'Risk Rating Medium', check: (data) => data.riskRating === 'Medium' },
  { name: 'LTV Below 60%', check: (data) => (data.loanRequired / data.purchasePrice) * 100 < 60 }
];

const App = () => {
  const [data, setData] = useState(null);
  const [results, setResults] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      const apiUrl = 'http://qa-gb.api.dynamatix.com:3100/api/applications/getApplicationById/67339ae56d5231c1a2c63639';
      try {
        const response = await fetch(apiUrl);
        const jsonData = await response.json();
        setData(jsonData);
        evaluateChecklist(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Evaluate checklist rules
  const evaluateChecklist = (data) => {
    const evaluationResults = checklistRules.map(rule => {
      const passed = rule.check(data);
      return { rule: rule.name, passed };
    });
    setResults(evaluationResults);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px' }}>
      <h1>Checklist Evaluation Results</h1>
      {results.length > 0 ? (
        <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ padding: '8px' }}>Rule</th>
              <th style={{ padding: '8px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <tr key={index}>
                <td style={{ padding: '8px' }}>{result.rule}</td>
                <td style={{ padding: '8px', color: result.passed ? 'green' : 'red' }}>
                  {result.passed ? 'Passed' : 'Failed'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default App;

