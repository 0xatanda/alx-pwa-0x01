# alx-project-0x14
API Explorer: Mastering RESTful Connections

## API Overview

The TMDb (The Movie Database) API is a comprehensive RESTful service that provides access to an extensive, community-supported database of movies, TV shows, and people (actors, directors, etc.). This API enables developers to retrieve rich metadata including titles, overviews, genres, release dates, images, credits (cast & crew), reviews, ratings, and search/discover content using various filters.

The API is particularly useful for building movie/TV web applications, recommendation systems, streaming guides, or any application requiring entertainment metadata. It offers both read and write capabilities, allowing users to not only fetch data but also submit ratings and reviews.

## Version

The TMDb API is currently on version 3, as indicated by the "3" in the base path. TMDb also offers a newer v4 API for some endpoints, which is documented separately. This project focuses on the v3 API endpoints.

## Available Endpoints

Below are the primary endpoints available in the TMDb API:

| Endpoint | HTTP Method | Purpose / Description |
|----------|-------------|----------------------|
| `/movie/{movie_id}` | GET | Get detailed information about a movie by its ID (title, overview, runtime, etc.) |
| `/movie/{movie_id}/credits` | GET | Get cast and crew details (actors, director, etc.) for a movie |
| `/search/movie` | GET | Search for movies by title, with query parameters like page, year, etc. |
| `/discover/movie` | GET | Discover movies by filters (genre, vote average, release date, etc.) |
| `/movie/{movie_id}/rating` | POST / DELETE | Submit or delete a user rating for a movie (requires authentication) |
| `/genre/movie/list` | GET | List all movie genres (with IDs) |
| `/tv/{tv_id}` | GET | Get detailed info about a TV show by ID |
| `/search/tv` | GET | Search for TV shows by name |
| `/person/{person_id}` | GET | Get detailed info about a person (actor, crew) |
| `/search/multi` | GET | Perform a "multi" search across movies, TV, and people in one query |

*Note: This is not an exhaustive list. The official documentation includes many more endpoints for images, recommendations, similar content, changes, lists, and external IDs.*

## Request and Response Format

### Base URL & Common Prefix

Most v3 API requests use the base URL:
```
https://api.themoviedb.org/3/
```

You then append the endpoint path (e.g., `movie/550`) and include query parameters. All responses are JSON-formatted.

### Example: Request `/movie/{movie_id}`

**Request:**
```http
GET https://api.themoviedb.org/3/movie/550
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

**Sample Response (abridged):**
```json
{
  "adult": false,
  "backdrop_path": "/some_path.jpg",
  "belongs_to_collection": null,
  "budget": 63000000,
  "genres": [
    { "id": 18, "name": "Drama" }
  ],
  "homepage": "http://someurl.com",
  "id": 550,
  "imdb_id": "tt0137523",
  "original_language": "en",
  "original_title": "Fight Club",
  "overview": "A depressed man...",
  "popularity": 45.3,
  "poster_path": "/poster.jpg",
  "production_companies": [ /* ... */ ],
  "release_date": "1999-10-15",
  "revenue": 100853753,
  "runtime": 139,
  "spoken_languages": [ /* ... */ ],
  "status": "Released",
  "tagline": "Mischief. Mayhem. Soap.",
  "title": "Fight Club",
  "vote_average": 8.4,
  "vote_count": 34321
}
```

### Example: Request `/movie/{movie_id}/credits`

**Request:**
```http
GET https://api.themoviedb.org/3/movie/550/credits
Authorization: Bearer YOUR_ACCESS_TOKEN
Accept: application/json
```

**Sample Response (abridged):**
```json
{
  "id": 550,
  "cast": [
    {
      "cast_id": 4,
      "character": "The Narrator",
      "credit_id": "52fe4250c3a36847f80149f3",
      "gender": 2,
      "id": 819,
      "name": "Edward Norton",
      "order": 0,
      "profile_path": "/path.jpg"
    }
  ],
  "crew": [
    {
      "credit_id": "52fe4250c3a36847f80149bf",
      "department": "Directing",
      "gender": 2,
      "id": 7467,
      "job": "Director",
      "name": "David Fincher",
      "profile_path": "/path2.jpg"
    }
  ]
}
```

*Note: Some fields are optional or may appear as null depending on the movie. Image paths (poster_path, backdrop_path) provide only partial paths; you need to prepend a base image URL (available in configuration endpoints) to build full image URLs.*

## Authentication

You need a valid API Read Access Token to make requests to the TMDb API. The token should be included in the Authorization header as a Bearer token:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Some endpoints might also allow API key via query parameter (e.g., `?api_key=XYZ`) depending on the API version or mode. You may also need to set `Accept: application/json` in headers, though JSON is usually the default format.

## Error Handling

When something goes wrong (e.g., bad API key, resource not found, invalid request), TMDb returns an HTTP status code plus a JSON object describing the error:

```json
{
  "status_code": 34,
  "status_message": "The resource you requested could not be found.",
  "success": false
}
```

### Common Error Cases and Handling

| HTTP Status | Meaning | Sample Body / status_code | Suggested Handling |
|-------------|---------|---------------------------|-------------------|
| 401 Unauthorized | Invalid or missing token | `"status_code": 7, "status_message": "Invalid API key..."` | Refresh or correct the token, don't retry repeatedly without delay |
| 404 Not Found | The resource doesn't exist | `"status_code": 34, "status_message": "The resource you requested could not be found."` | Inform user "not found", don't try again with same ID |
| 400 Bad Request | Invalid parameters | Status message will indicate what's wrong | Validate parameters on client side before sending |
| 429 Too Many Requests | Rate limit exceeded | May return a `Retry-After` header | Throttle requests, implement exponential backoff, pause before retrying |
| 5xx Server Error | Server-side error | Status message may be generic | Retry after delay, possibly implement fallback logic |

In your code, wrap API calls in try/catch blocks, check HTTP status codes, and surface meaningful error messages to users (e.g., "Movie not found", "Rate limit exceeded — wait and retry", etc.).

## Usage Limits and Best Practices

TMDb enforces rate limiting (requests per second or per time window). The exact limits depend on your API plan and usage tier.

### Best Practices:

1. **Rate Limiting**: Avoid hitting limits by batching requests, caching responses (especially for data unlikely to change often, like movie metadata or genres), and reusing data across calls.

2. **Pagination**: Use pagination when retrieving large lists (e.g., `/search/movie` returns multiple pages) rather than trying to fetch everything at once.

3. **Efficient Requests**: Don't request unnecessary fields — many endpoints support filtering or appending only needed parts (e.g., `append_to_response=videos,credits`).

4. **Error Handling**: Respect "retry-after" headers or backoff hints. Handle errors gracefully and avoid infinite retry loops.

5. **Monitoring**: Log your requests (endpoints, params, response times) for debugging and performance monitoring.

6. **Terms of Service**: Read and abide by the API terms of service, especially for commercial usage (some usage tiers may require negotiation with TMDb).

7. **Caching Strategy**: Implement appropriate caching strategies for static data like genres, configuration, and movie metadata to reduce API calls and improve performance.