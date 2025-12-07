// const express = require("express");
// const sql = require("mssql");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const firestore = require("./firebase");

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 🔧 MS SQL Server config
// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   // port: Number(process.env.DB_PORT),
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

// // 🔄 Transform function (UPDATED FOR NEW TABLE)
// function transformSensorData(rawData) {
//   const transformedData = [];

//   // ⚠️ IMPORTANT: These keys must match your SQL Column names EXACTLY
//   const sensorMapping = {
//     // Header
//     "Well 1 Pressure": { category: "Header", unit: "kg/cm^2" },
//     "Well 2 Pressure": { category: "Header", unit: "kg/cm^3" },
//     "Well 3 Pressure": { category: "Header", unit: "kg/cm^4" },
//     "Well 4 Pressure": { category: "Header", unit: "kg/cm^5" },
//     "Flare Header Pressure": { category: "Header", unit: "kg/cm^6" },
//     "Production Header Pressure": { category: "Header", unit: "kg/cm^7" },
//     "Test Header Pressure": { category: "Header", unit: "kg/cm^8" },
//     "Production Heder Temp.": { category: "Header", unit: "°C" }, // Note: Check spelling in SQL "Heder" vs "Header"
//     "Test Heder Temp.": { category: "Header", unit: "°C" },
//     "Manifold Flare Header DPT": { category: "Header", unit: "M3/HR" },

//     // Test Separator
//     "PS Inlet Pressure": { category: "Test Separator", unit: "psi" },
//     "PS Vessel Pressure": { category: "Test Separator", unit: "kg/cm^2" },
//     "TS Inlet Pressure": { category: "Test Separator", unit: "psi" },
//     "TS Vessel Pressure": { category: "Test Separator", unit: "kg/cm^2" },
//     "TS Gas Outlet Pressure": { category: "Test Separator", unit: "psi" },
//     "Condesate Vessel Pressure": {
//       category: "Test Separator",
//       unit: "kg/cm^2",
//     },
//     "Effluent Vessel Pressure": { category: "Test Separator", unit: "kg/cm^2" },
//     "Gas Scrubber Vessel Pressure": {
//       category: "Test Separator",
//       unit: "kg/cm^2",
//     },
//     "TS Gas Outlet DPT": { category: "Test Separator", unit: "M3/HR" },
//     "TS Condensate Outlet PDM": { category: "Test Separator", unit: "psi" },
//     "TS Effluent Outlet TFM": { category: "Test Separator", unit: "psi" },
//     "PS Inlet Temp.": { category: "Test Separator", unit: "°C" },
//     "PS Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Inlet Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Gas Outlet Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Condensate Outlet Temp.": { category: "Test Separator", unit: "°C" },
//     "Condensate Stabilizer Outline Temp.": {
//       category: "Test Separator",
//       unit: "°C",
//     },
//     "Effluent Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "Gas Scrubber Vessel Temp.": { category: "Test Separator", unit: "°C" },

//     // RTDs (Updated: Removed 13, 14, 15 as they are not in new data)
//     "RTD-16": { category: "Misc", unit: "°C" },

//     // Metering Skid (Updated)
//     "Metering Skid Line 1 DPT": { category: "Metering Skid", unit: "M3/HR" },
//     "Metering Skid Line 2 DPT": { category: "Metering Skid", unit: "M3/HR" },
//     "Condesate Outline PDM": { category: "Metering Skid", unit: "psi" },

//     // NEW FLOW COLUMNS (Added based on new table structure)
//     "Metering Skid Line 1 FLOW": { category: "Metering Skid", unit: "M3/HR" }, // Check your unit
//     "Metering Skid Line 2 FLOW": { category: "Metering Skid", unit: "M3/HR" }, // Check your unit
//   };

//   for (const key in rawData) {
//     // Skip Metadata columns
//     if (key === "Batch_Date" || key === "Batch_Time") continue;

//     const sensorInfo = sensorMapping[key];

//     // Only push if the column exists in our mapping AND has data
//     if (sensorInfo && rawData[key] !== null) {
//       transformedData.push({
//         Category: sensorInfo.category,
//         Sensor: key,
//         Measurement: rawData[key],
//         Unit: sensorInfo.unit,
//       });
//     }
//   }

//   return transformedData;
// }

// // 🔄 Sync loop
// setInterval(async () => {
//   try {
//     let pool = await sql.connect(config);

//     // ✅ Step 1: Updated Query
//     // 1. Changed table name to dbo.SensorData (or whatever you named it)
//     // 2. Changed ORDER BY to handle the String Time format
//     const latestRowResult = await pool.request().query(`
//       SELECT TOP 1 *
//       FROM dbo.SensorData 
//       ORDER BY Batch_Date DESC, Batch_Time DESC
//     `);

//     if (latestRowResult.recordset.length === 0) {
//       console.log("⚠️ No data found in SensorData table.");
//       return;
//     }

//     const latestRow = latestRowResult.recordset[0];

//     // ✅ Step 2: Transform
//     const transformedData = transformSensorData(latestRow);
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
//     const day = date.getDate().toString().padStart(2, "0");
//     const customDate = `${day}-${month}-${year}`;
//     const fullTimeString = date.toTimeString();
//     const time = fullTimeString.slice(0, 8);
//     // ✅ Step 3: Wrap
//     const combinedData = {
//       sensors: transformedData,
//       updatedAt: `${customDate}-${time}`,
//       // Optional: Send Batch info too if you want it displayed
//       batchInfo: {
//         date: latestRow.Batch_Date,
//         time: latestRow.Batch_Time,
//       },
//     };
//     const singleString = JSON.stringify(combinedData);

//     // ✅ Step 4: Push to Firestore
//     const mainDoc = firestore.collection("sensors").doc("latestData");
//     await mainDoc.set({ data: singleString }, { merge: true });

//     console.log(
//       `🔥 Synced latest row → Firestore at ${new Date().toLocaleTimeString()}`
//     );
//   } catch (err) {
//     console.error("❌ Error syncing:", err);
//   }
// }, 3000);

// // 🚀 Start server
// app.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });



// const express = require("express");
// const sql = require("mssql");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const firestore = require("./firebase");

// dotenv.config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // 🔧 MS SQL Server config
// const config = {
//   user: process.env.DB_USER,
//   password: process.env.DB_PASS,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   // port: Number(process.env.DB_PORT),
//   options: {
//     encrypt: true,
//     trustServerCertificate: true,
//   },
// };

// // 🔄 Transform function (UPDATED FOR NEW TABLE)
// function transformSensorData(rawData) {
//   const transformedData = [];

//   // ⚠️ IMPORTANT: These keys must match your SQL Column names EXACTLY
//   const sensorMapping = {
//     // Header
//     "Well 1 Pressure": { category: "Header", unit: "kg/cm 2" },
//     "Well 2 Pressure": { category: "Header", unit: "kg/cm 3" },
//     "Well 3 Pressure": { category: "Header", unit: "kg/cm 4" },
//     "Well 4 Pressure": { category: "Header", unit: "kg/cm 5" },
//     "Flare Header Pressure": { category: "Header", unit: "kg/cm 6" },
//     "Production Header Pressure": { category: "Header", unit: "kg/cm 7" },
//     "Test Header Pressure": { category: "Header", unit: "kg/cm 8" },
//     "Production Heder Temp.": { category: "Header", unit: "°C" }, // Note: Check spelling in SQL "Heder" vs "Header"
//     "Test Heder Temp.": { category: "Header", unit: "°C" },
//     "Manifold Flare Header DPT": { category: "Header", unit: "M3/HR" },

//     // Test Separator
//     "PS Inlet Pressure": { category: "Test Separator", unit: "psi" },
//     "PS Vessel Pressure": { category: "Test Separator", unit: "kg/cm 2" },
//     "TS Inlet Pressure": { category: "Test Separator", unit: "psi" },
//     "TS Vessel Pressure": { category: "Test Separator", unit: "kg/cm 2" },
//     "TS Gas Outlet Pressure": { category: "Test Separator", unit: "psi" },
//     "Condesate Vessel Pressure": {
//       category: "Test Separator",
//       unit: "kg/cm 2",
//     },
//     "Effluent Vessel Pressure": { category: "Test Separator", unit: "kg/cm 2" },
//     "Gas Scrubber Vessel Pressure": {
//       category: "Test Separator",
//       unit: "kg/cm 2",
//     },
//     "TS Gas Outlet DPT": { category: "Test Separator", unit: "M3/HR" },
//     "TS Condensate Outlet PDM": { category: "Test Separator", unit: "psi" },
//     "TS Effluent Outlet TFM": { category: "Test Separator", unit: "psi" },
//     "PS Inlet Temp.": { category: "Test Separator", unit: "°C" },
//     "PS Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Inlet Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Gas Outlet Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Condensate Outlet Temp.": { category: "Test Separator", unit: "°C" },
//     "Condensate Stabilizer Outline Temp.": {
//       category: "Test Separator",
//       unit: "°C",
//     },
//     "Effluent Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "Gas Scrubber Vessel Temp.": { category: "Test Separator", unit: "°C" },

//     // RTDs (Updated: Removed 13, 14, 15 as they are not in new data)
//     "RTD-16": { category: "Misc", unit: "°C" },

//     // Metering Skid (Updated)
//     "Metering Skid Line 1 DPT": { category: "Metering Skid", unit: "M3/HR" },
//     "Metering Skid Line 2 DPT": { category: "Metering Skid", unit: "M3/HR" },
//     "Condesate Outline PDM": { category: "Metering Skid", unit: "psi" },

//     // NEW FLOW COLUMNS (Added based on new table structure)
//     "Metering Skid Line 1 FLOW": { category: "Metering Skid", unit: "M3/HR" }, // Check your unit
//     "Metering Skid Line 2 FLOW": { category: "Metering Skid", unit: "M3/HR" }, // Check your unit
//   };

//   for (const key in rawData) {
//     // Skip Metadata columns
//     if (key === "Batch_Date" || key === "Batch_Time") continue;

//     const sensorInfo = sensorMapping[key];

//     // Only push if the column exists in our mapping AND has data
//     if (sensorInfo && rawData[key] !== null) {
  //       transformedData.push({
//         Category: sensorInfo.category,
//         Sensor: key,
//         Measurement: rawData[key],
//         Unit: sensorInfo.unit,
//       });
//     }
//   }

//   return transformedData;
// }

// // 🔄 Sync loop
// setInterval(async () => {
//   try {
  //     let pool = await sql.connect(config);

  //     // ✅ Step 1: Updated Query
//     // 1. Changed table name to dbo.SensorData (or whatever you named it)
//     // 2. Changed ORDER BY to handle the String Time format
//     const latestRowResult = await pool.request().query(`
//       SELECT TOP 1 *
//       FROM dbo.SensorData 
//       ORDER BY Batch_Date DESC, Batch_Time DESC
//     `);

//     if (latestRowResult.recordset.length === 0) {
//       console.log("⚠️ No data found in SensorData table.");
//       return;
//     }

//     const latestRow = latestRowResult.recordset[0];

//     // ✅ Step 2: Transform
//     const transformedData = transformSensorData(latestRow);
//     const date = new Date();
//     const year = date.getFullYear();
//     const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
//     const day = date.getDate().toString().padStart(2, "0");
//     const customDate = `${day}-${month}-${year}`;
//     const fullTimeString = date.toTimeString();
//     const time = fullTimeString.slice(0, 8);
//     // ✅ Step 3: Wrap
//     const combinedData = {
//       sensors: transformedData,
//       updatedAt: `${customDate}-${time}`,
//       // Optional: Send Batch info too if you want it displayed
//       batchInfo: {
//         date: latestRow.Batch_Date,
//         time: latestRow.Batch_Time,
//       },
//     };
//     const singleString = JSON.stringify(combinedData);

//     // ✅ Step 4: Push to Firestore
//     const mainDoc = firestore.collection("sensors").doc("latestData");
//     await mainDoc.set({ data: singleString }, { merge: true });

//     console.log(
//       `🔥 Synced latest row → Firestore at ${new Date().toLocaleTimeString()}`
//     );
//   } catch (err) {
  //     console.error("❌ Error syncing:", err);
  //   }
  // }, 3000);
  
  // // 🚀 Start server
  // app.listen(5000, () => {
//   console.log("🚀 Server running on http://localhost:5000");
// });

const express = require("express");
const sql = require("mssql");
const cors = require("cors");
const dotenv = require("dotenv");
const firestore = require("./firebase");
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
// const config = {
  //   user: process.env.DB_USER,
  //   password: process.env.DB_PASS,
//   server: process.env.DB_SERVER,
//   database: process.env.DB_NAME,
//   // port: Number(process.env.DB_PORT),
//   options: {
  //     encrypt: true,
  //     trustServerCertificate: true,
  //   },
  // };
  
  
  const config = {
    server: 'localhost',
  database: 'ongc',
  user: 'sa',
  password: 'password',
  options: {
    encrypt: false
  }
}
sql.connect(config, error => {
  if (error) {
    console.log(error);
  } else {
    console.log('Connection Established Successfully');
    const request = new sql.Request()
    request.query("SELECT * FROM dbo.HTTable", (error, result) => {
      if (error) {
        console.log(`cant find the table`);
      } else {
        console.log(result.recordset);
      }
    })
  }
})

//     "Well 1 Pressure": { category: "Header", unit: "kg/cm 2" },
//     "Well 2 Pressure": { category: "Header", unit: "kg/cm 3" },
//     "Well 3 Pressure": { category: "Header", unit: "kg/cm 4" },
//     "Well 4 Pressure": { category: "Header", unit: "kg/cm 5" },
//     "Flare Header Pressure": { category: "Header", unit: "kg/cm 6" },
//     "Production Header Pressure": { category: "Header", unit: "kg/cm 7" },
//     "Test Header Pressure": { category: "Header", unit: "kg/cm 8" },
//     "Production Heder Temp.": { category: "Header", unit: "°C" }, // Note: Check spelling in SQL "Heder" vs "Header"
//     "Test Heder Temp.": { category: "Header", unit: "°C" },
//     "Manifold Flare Header DPT": { category: "Header", unit: "M3/HR" },

//     // Test Separator
//     "PS Inlet Pressure": { category: "Test Separator", unit: "psi" },
//     "PS Vessel Pressure": { category: "Test Separator", unit: "kg/cm 2" },
//     "TS Inlet Pressure": { category: "Test Separator", unit: "psi" },
//     "TS Vessel Pressure": { category: "Test Separator", unit: "kg/cm 2" },
//     "TS Gas Outlet Pressure": { category: "Test Separator", unit: "psi" },
//     "Condesate Vessel Pressure": {
//       category: "Test Separator",
//       unit: "kg/cm 2",
//     },
//     "Effluent Vessel Pressure": { category: "Test Separator", unit: "kg/cm 2" },
//     "Gas Scrubber Vessel Pressure": {
//       category: "Test Separator",
//       unit: "kg/cm 2",
//     },
//     "TS Gas Outlet DPT": { category: "Test Separator", unit: "M3/HR" },
//     "TS Condensate Outlet PDM": { category: "Test Separator", unit: "psi" },
//     "TS Effluent Outlet TFM": { category: "Test Separator", unit: "psi" },
//     "PS Inlet Temp.": { category: "Test Separator", unit: "°C" },
//     "PS Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Inlet Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Gas Outlet Temp.": { category: "Test Separator", unit: "°C" },
//     "TS Condensate Outlet Temp.": { category: "Test Separator", unit: "°C" },
//     "Condensate Stabilizer Outline Temp.": {
//       category: "Test Separator",
//       unit: "°C",
//     },
//     "Effluent Vessel Temp.": { category: "Test Separator", unit: "°C" },
//     "Gas Scrubber Vessel Temp.": { category: "Test Separator", unit: "°C" },

//     // RTDs (Updated: Removed 13, 14, 15 as they are not in new data)
//     "RTD-16": { category: "Misc", unit: "°C" },

//     // Metering Skid (Updated)
//     "Metering Skid Line 1 DPT": { category: "Metering Skid", unit: "M3/HR" },
//     "Metering Skid Line 2 DPT": { category: "Metering Skid", unit: "M3/HR" },
//     "Condesate Outline PDM": { category: "Metering Skid", unit: "psi" },

//     // NEW FLOW COLUMNS (Added based on new table structure)
//     "Metering Skid Line 1 FLOW": { category: "Metering Skid", unit: "M3/HR" }, // Check your unit
//     "Metering Skid Line 2 FLOW": { category: "Metering Skid", unit: "M3/HR" }, // Check your unit
//   };

// 🔄 Transform function (UPDATED FOR NEW TABLE)
function transformSensorData(rawData) {
  const transformedData = [];

  // Smart categorizer rules
  const smartCategories = [
  // Header
  { keywords: ["well 1 pressure"], category: "Header", unit: "kg/cm 2" },
  { keywords: ["well 2 pressure"], category: "Header", unit: "kg/cm 3" },
  { keywords: ["well 3 pressure"], category: "Header", unit: "kg/cm 4" },
  { keywords: ["well 4 pressure"], category: "Header", unit: "kg/cm 5" },
  { keywords: ["flare header pressure"], category: "Header", unit: "kg/cm 6" },
  { keywords: ["production header pressure"], category: "Header", unit: "kg/cm 7" },
  { keywords: ["test header pressure"], category: "Header", unit: "kg/cm 8" },
  { keywords: ["production heder temp"], category: "Header", unit: "°C" },
  { keywords: ["test heder temp"], category: "Header", unit: "°C" },
  { keywords: ["manifold flare header dpt"], category: "Header", unit: "M3/HR" },

  // Test Separator
  { keywords: ["ps inlet pressure"], category: "Test Separator", unit: "psi" },
  { keywords: ["ps vessel pressure"], category: "Test Separator", unit: "kg/cm 2" },
  { keywords: ["ts inlet pressure"], category: "Test Separator", unit: "psi" },
  { keywords: ["ts vessel pressure"], category: "Test Separator", unit: "kg/cm 2" },
  { keywords: ["ts gas outlet pressure"], category: "Test Separator", unit: "psi" },
  { keywords: ["condesate vessel pressure"], category: "Test Separator", unit: "kg/cm 2" },
  { keywords: ["effluent vessel pressure"], category: "Test Separator", unit: "kg/cm 2" },
  { keywords: ["gas scrubber vessel pressure"], category: "Test Separator", unit: "kg/cm 2" },
  { keywords: ["ts gas outlet dpt"], category: "Test Separator", unit: "M3/HR" },
  { keywords: ["ts condensate outlet pdm"], category: "Test Separator", unit: "psi" },
  { keywords: ["ts effluent outlet tfm"], category: "Test Separator", unit: "psi" },

  { keywords: ["ps inlet temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["ps vessel temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["ts inlet temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["ts vessel temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["ts gas outlet temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["ts condensate outlet temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["condensate stabilizer outline temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["effluent vessel temp"], category: "Test Separator", unit: "°C" },
  { keywords: ["gas scrubber vessel temp"], category: "Test Separator", unit: "°C" },

  // Misc
  { keywords: ["rtd-16"], category: "Misc", unit: "°C" },

  // Metering Skid
  { keywords: ["metering skid line 1 dpt"], category: "Metering Skid", unit: "M3/HR" },
  { keywords: ["metering skid line 2 dpt"], category: "Metering Skid", unit: "M3/HR" },
  { keywords: ["condesate outline pdm"], category: "Metering Skid", unit: "psi" },

  // New FLOW Columns
  { keywords: ["metering skid line 1 flow"], category: "Metering Skid", unit: "M3/HR" },
  { keywords: ["metering skid line 2 flow"], category: "Metering Skid", unit: "M3/HR" },
];

  
  function categorizeSensor(sensorName) {
    const name = sensorName.toLowerCase();
    
    for (const rule of smartCategories) {
      if (rule.keywords.some(kw => name.includes(kw))) {
        return { category: rule.category, unit: rule.unit };
      }
    }

    // Default fallback
    return { category: "General", unit: "NA" };
  }
  
  for (const key in rawData) {
    if (key === "Batch_Date" || key === "Batch_Time") continue;

    const { category, unit } = categorizeSensor(key);

    transformedData.push({
      Category: category,
      Sensor: key,
      Measurement: rawData[key],
      Unit: unit
    });
  }

  return transformedData;
}



// 🔄 Sync loop
setInterval(async () => {
  try {
    let pool = await sql.connect(config);

    // ✅ Step 1: Updated Query
    // 1. Changed table name to dbo.SensorData (or whatever you named it)
    // 2. Changed ORDER BY to handle the String Time format
    const latestRowResult = await pool.request().query(`
      SELECT TOP 1 *
      FROM dbo.HTTable 
      ORDER BY Batch_Date DESC, Batch_Time DESC
    `);
    if (latestRowResult.recordset.length === 0) {
      console.log("⚠️ No data found in SensorData table.");
      return;
    }

    const latestRow = latestRowResult.recordset[0];
    // ✅ Step 2: Transform
    const transformedData = transformSensorData(latestRow);
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are 0-indexed
    const day = date.getDate().toString().padStart(2, "0");
    const customDate = `${day}-${month}-${year}`;
    const fullTimeString = date.toTimeString();
    const time = fullTimeString.slice(0, 8);
    // ✅ Step 3: Wrap
    const combinedData = {
      sensors: transformedData,
      updatedAt: `${customDate}-${time}`,
      // Optional: Send Batch info too if you want it displayed
      batchInfo: {
        date: latestRow.Batch_Date,
        time: latestRow.Batch_Time,
      },
    };
    const singleString = JSON.stringify(combinedData);

    // ✅ Step 4: Push to Firestore
    const mainDoc = firestore.collection("sensors").doc("latestData");
    await mainDoc.set({ data: singleString }, { merge: true });

    console.log(
      `🔥 Synced latest row → Firestore at ${new Date().toLocaleTimeString()}`
    );
  } catch (err) {
    console.error("❌ Error syncing:", err);
  }
}, 3000);

// 🚀 Start server
app.listen(5000, () => {
  console.log("🚀 Server running on http://localhost:5000");
});