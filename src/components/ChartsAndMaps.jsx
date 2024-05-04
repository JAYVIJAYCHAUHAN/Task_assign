 import React, { useEffect, useState } from "react";
 import { Box, Flex, Heading } from "@chakra-ui/react";
 import { Link } from "react-router-dom";
 import axios from "axios";
 import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
 import Chart from "chart.js/auto";
 import "leaflet/dist/leaflet.css";
 import "../Css/ChartsAndMaps.css";

 const ChartsAndMaps = () => {
   const [chartData, setChartData] = useState({});
   const [countryData, setCountryData] = useState([]);

   const fetchChartData = async () => {
     try {
       const res = await axios.get("https://disease.sh/v3/covid-19/all");
       const data = res.data;

       // Process the data from the new API endpoint
       const chartData = {
         labels: [  "Cases", "Recovered", "Deaths"],
         datasets: [
           {
             label: "COVID-19 Cases",
             data: [  data.cases, data.recovered, data.deaths],
             backgroundColor: [  "red", "green", "gray"], // Update colors here
           },
         ],
       };
       setChartData(chartData);
     } catch (error) {
       console.error("Error fetching chart data:", error);
     }
   };

   const fetchCountryData = async () => {
     try {
       const res = await axios.get("https://disease.sh/v3/covid-19/countries");
       const data = res.data;

       const countryData = data.map((country) => ({
         name: country.country,
         lat: country.countryInfo.lat,
         long: country.countryInfo.long,
         updated: country.updated,
         active: country.active,
         recovered: country.recovered,
         deaths: country.deaths,
       }));

       setCountryData(countryData);
     } catch (error) {
       console.error("Error fetching country data:", error);
     }
   };

   useEffect(() => {
     fetchChartData();
     fetchCountryData();
   }, []);

   useEffect(() => {
     const chartConfig = {
       type: "bar",
       data: chartData,
     };

     const myChart = new Chart(document.getElementById("myChart"), chartConfig);
     return () => {
       myChart.destroy();
     };
   }, [chartData]);

   return (
     <div>
       <Heading color={"white"} p={"10px 20px"} bg={"#28686e"}>
         Charts and Maps
       </Heading>
       <div id="charts_page_div">
         {window.innerWidth > 900 ? (
           <Box
             padding={"10px"}
             w={"19%"}
             boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
           >
             <Box>
               <Link
                 style={{
                   textDecoration: "none",
                   fontSize: "20px",
                   fontWeight: "bold",
                 }}
                 to="/"
               >
                 Contacts
               </Link>
             </Box>
             <br />
             <br />
             <Box>
               <Link
                 style={{
                   textDecoration: "none",
                   fontSize: "20px",
                   fontWeight: "bold",
                 }}
                 to="/chartsandmaps"
               >
                 Charts & Maps
               </Link>
             </Box>
           </Box>
         ) : (
           <Flex
             justifyContent={"space-evenly"}
             w={"100%"}
             margin={"auto"}
             marginBottom={"20px"}
             p={"10px 0px"}
             boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
           >
             <Box>
               <Link
                 style={{
                   textDecoration: "none",
                   fontSize: "20px",
                   fontWeight: "bold",
                 }}
                 to="/"
               >
                 Contacts
               </Link>
             </Box>
             <Box>
               <Link
                 style={{
                   textDecoration: "none",
                   fontSize: "20px",
                   fontWeight: "bold",
                 }}
                 to="/chartsandmaps"
               >
                 Charts & Maps
               </Link>
             </Box>
           </Flex>
         )}
         <Box
           padding={"30px"}
           margin={"auto"}
           w={"79%"}
           boxShadow={"rgba(0, 0, 0, 0.24) 0px 3px 8px"}
           border={"1px solid gray"}
         >
           <Heading>COVID-19 Dashboard</Heading>
           <Box>
             <canvas id="myChart" width="800" height="300"></canvas>
           </Box>
           <br />
           <br />
           <Box>
             <MapContainer center={[0, 0]} zoom={2}>
               <TileLayer url="https://api.maptiler.com/maps/basic-v2/256/{z}/{x}/{y}.png?key=NLe8DG6CVIhkI4PpAXR1" />
               {countryData.map((country) => (
                 <Marker
                   key={country.name}
                   position={[country.lat, country.long]}
                 >
                   <Popup>
                     <h4>Name: {country.name}</h4>
                     
                     <p>Active Cases: {country.active}</p>
                     <p>Recovered Cases: {country.recovered}</p>
                     <p>Deaths: {country.deaths}</p>
                   </Popup>
                 </Marker>
               ))}
             </MapContainer>
           </Box>
         </Box>
       </div>
     </div>
   );
 };

 export default ChartsAndMaps;
