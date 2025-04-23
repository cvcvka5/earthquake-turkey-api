
# Kandilli Rasathanesi Earthquake Data API

This API provides real-time earthquake data fetched from the Kandilli Observatory in Turkey. It enables developers to access earthquake details such as date, time, magnitude, depth, and location, with several query filters for precision.

## Features

- Fetch all earthquake data from the Kandilli Observatory.
- Filter results by:
  - Date
  - Time
  - Latitude & Longitude (proximity search)
  - Earthquake magnitude (duration, local, moment)
  - Location name
- Retrieve the most recent earthquake data.

## Key Techniques

- **Web Scraping with Cheerio**: Extracts earthquake data from the Kandilli Observatory website using [Cheerio](https://cheerio.js.org/), a lightweight, fast, and flexible library for parsing HTML.
  
- **Handling Turkish Character Encoding**: [Iconv-lite](https://github.com/ashtuchkin/iconv-lite) ensures correct handling of Turkish characters in the fetched data by decoding them properly.

- **Query Parameters & Filtering**: Allows dynamic filtering of earthquake data using query parameters in the URL. Parameters like date, time, location, and magnitude are supported.

- **Geospatial Proximity Filtering**: Implements basic proximity filtering for earthquake data based on latitude and longitude. Users can query earthquakes near a specific location.

- **Data Parsing with Regular Expressions**: Earthquake data is parsed using regular expressions to cleanly extract the needed information.

## Libraries and Technologies Used

- **[Express.js](https://expressjs.com/)**: Framework for building the RESTful API.
- **[Axios](https://axios-http.com/)**: Used for fetching data from the external site.
- **[Cheerio](https://cheerio.js.org/)**: Parses HTML content for web scraping.
- **[Iconv-lite](https://github.com/ashtuchkin/iconv-lite)**: Decodes character encodings (important for Turkish characters).


## Endpoints

### 1. Get All Earthquake Data
- **Endpoint**: `/all`
- **Method**: `GET`
- **Description**: Fetches all earthquake data from the Kandilli Observatory.

### 2. Get Earthquake Data by Date and Time
- **Endpoint**: `/at`
- **Method**: `GET`
- **Query Parameters**:
  - `date`: The date to filter by (e.g., `2025.04.22`).
  - `time`: The time to filter by (e.g., `19:56:02`).
- **Description**: Filters earthquake data based on the provided date and time.

### 3. Get Earthquake Data by Proximity
- **Endpoint**: `/near`
- **Method**: `GET`
- **Query Parameters**:
  - `latitude`: Latitude for proximity search (e.g., `38.2187`).
  - `longitude`: Longitude for proximity search (e.g., `44.0542`).
  - `radius`: Search radius in kilometers (optional).
- **Description**: Filters earthquake data based on proximity to the provided latitude and longitude.

### 4. Get Earthquake Data by Location Name
- **Endpoint**: `/in`
- **Method**: `GET`
- **Query Parameter**:
  - `location`: The location name to filter by (e.g., `YOLMACAYIR-BASKALE`).
- **Description**: Filters earthquake data by location name.

### 5. Get the Most Recent Earthquake Data
- **Endpoint**: `/last/{count}`
- **Method**: `GET`
- **Path Parameter**:
  - `count`: The number of recent earthquake events to fetch (optional, defaults to `1`).
- **Description**: Fetches the most recent earthquake events (based on the count parameter).

### 6. Filter Earthquake Data by Multiple Parameters
- **Endpoint**: `/filter`
- **Method**: `GET`
- **Query Parameters**:
  - `date`: Filter by date (e.g., `2025.04.22`).
  - `time`: Filter by time (e.g., `19:56:02`).
  - `latitude`: Filter by latitude.
  - `longitude`: Filter by longitude.
  - `depth`: Filter by depth.
  - `md`: Filter by magnitude (duration).
  - `ml`: Filter by magnitude (local).
  - `mw`: Filter by magnitude (moment).
  - `location`: Filter by location name.
- **Description**: Allows filtering of earthquake data using multiple parameters like date, time, location, and magnitude.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


## License

The copyright for all types of information, data, and maps published on our website exclusively belongs to the Boğaziçi University Rectorate. These resources may be used by citing the Boğaziçi University Kandilli Observatory and Earthquake Research Institute's Regional Earthquake-Tsunami Monitoring and Evaluation Center as the source. The mentioned information, data, and maps cannot be used for commercial purposes in any way without the written permission and approval of the Boğaziçi University Rectorate.
