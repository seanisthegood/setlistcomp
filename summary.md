# Project Summary

## Ideas and Goals

1. **Basic Functionality Without Login**:
   - Allow users to search for concerts and view YouTube links without requiring them to log in.
   - Provide basic functionality to attract users and let them explore the site.

2. **Advanced Functionality with Login**:
   - Require users to log in with their YouTube accounts for advanced features.
   - Allow logged-in users to save videos to playlists and access more extensive concert history.
   - Distribute the API call load by using users' YouTube accounts.

3. **Dropdown Menus for Filtering**:
   - Implement dropdown menus for filtering concerts by year, artist, etc.
   - Allow users to narrow down their search and view specific subsets of their concert history.

4. **Improving Search with AI**:
   - Collect user feedback on search results to improve future searches.
   - Store search results and feedback for analysis.
   - Use machine learning models or heuristics to refine search queries and results over time.

## Steps to Implement

### 1. Basic Functionality Without Login

- **API Endpoint for Concert Data**: Create an API endpoint in Flask to return concert data without requiring login.
- **React Component**: Create a React component to fetch and display concert data.

### 2. Advanced Functionality with Login

- **OAuth 2.0 Setup**: Set up OAuth 2.0 credentials in the Google Cloud Console for YouTube login.
- **OAuth 2.0 Implementation in Flask**: Implement OAuth 2.0 in Flask to handle user authentication and authorization.
- **Save Videos to Playlist**: Add functionality to save videos to a user's YouTube playlist.

### 3. Dropdown Menus for Filtering

- **API Endpoint for Filter Options**: Create an API endpoint to fetch unique years and artists from the concert data.
- **React Component for Filters**: Create a React component to display dropdown menus for filtering by year and artist.
- **API Endpoint for Filtered Concert Data**: Create an API endpoint to return concert data based on selected filters.
- **React Component for Displaying Filtered Concerts**: Create a React component to fetch and display filtered concert data.

### 4. Improving Search with AI

- **Collect User Feedback**: Allow users to provide feedback on search results.
- **Store Feedback**: Create an API endpoint to store user feedback in a database.
- **Analyze Feedback**: Periodically analyze the feedback to improve search queries and results.
- **Machine Learning Models**: Use machine learning models or heuristics to refine search parameters based on user feedback.

## Summary of Immediate Tasks

1. **Update `search_youtube_live_videos` Function**:
   - Modify the function to return multiple video links.

2. **Create API Endpoints**:
   - Endpoint for concert data.
   - Endpoint for filter options.
   - Endpoint for filtered concert data.
   - Endpoint for storing user feedback.

3. **Implement OAuth 2.0**:
   - Set up OAuth 2.0 credentials.
   - Implement OAuth 2.0 in Flask for YouTube login.

4. **React Components**:
   - Component to fetch and display concert data.
   - Component to display dropdown menus for filtering.
   - Component to fetch and display filtered concert data.
   - Component to handle user feedback.

5. **Store and Analyze Feedback**:
   - Store search results and user feedback in a database.
   - Analyze feedback to improve the search functionality over time.