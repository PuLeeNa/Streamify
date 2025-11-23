import { Client, Databases, ID, Query } from 'react-native-appwrite';

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_COLLECTION_ID!;
const SAVED_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_COLLECTION_ID!;

const client = new Client()
    .setEndpoint(process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!)
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!);

const database = new Databases(client);

export const updateSearchCount = async (query: string, movie: Movie) => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.equal('searchTerm', query)
        ]);

        if (result.documents.length > 0) {
            const existingMovie = result.documents[0];

            await database.updateDocument(
                DATABASE_ID,
                COLLECTION_ID,
                existingMovie.$id,
                {
                    count: existingMovie.count + 1,
                }
            )
        } else {
            await database.createDocument(
                DATABASE_ID,
                COLLECTION_ID,
                ID.unique(),
                {
                    searchTerm: query,
                    movie_id: movie.id,
                    title: movie.title,
                    count: 1,
                    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                }
            )
        }
    } catch (error) {
        console.error('Error updating search count:', error);
    }
}

export const getTrendingMovies = async (): Promise<TrendingMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
            Query.limit(20),
            Query.orderDesc('count'),
        ]);

        // Filter to get unique movies (keep only the highest ranked one per movie_id)
        const seenMovieIds = new Set<number>();
        const uniqueMovies = (result.documents as unknown as TrendingMovie[]).filter(movie => {
            if (seenMovieIds.has(movie.movie_id)) {
                return false;
            }
            seenMovieIds.add(movie.movie_id);
            return true;
        });

        return uniqueMovies.slice(0, 5);
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        return undefined;
    }
}

// Saved Movies Functions
export const saveMovie = async (movie: Movie | MovieDetails): Promise<boolean> => {
    try {
        // Check if movie is already saved
        const existing = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
            Query.equal('movie_id', movie.id)
        ]);

        if (existing.documents.length > 0) {
            console.log('Movie already saved');
            return false;
        }

        await database.createDocument(
            DATABASE_ID,
            SAVED_COLLECTION_ID,
            ID.unique(),
            {
                movie_id: movie.id,
                title: movie.title,
                poster_path: movie.poster_path,
                vote_average: movie.vote_average,
                release_date: movie.release_date,
                overview: movie.overview,
                saved_at: new Date().toISOString(),
            }
        );
        return true;
    } catch (error) {
        console.error('Error saving movie:', error);
        return false;
    }
}

export const removeSavedMovie = async (movieId: number): Promise<boolean> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
            Query.equal('movie_id', movieId)
        ]);

        if (result.documents.length > 0) {
            await database.deleteDocument(
                DATABASE_ID,
                SAVED_COLLECTION_ID,
                result.documents[0].$id
            );
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error removing saved movie:', error);
        return false;
    }
}

export const getSavedMovies = async (): Promise<SavedMovie[] | undefined> => {
    try {
        const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
            Query.orderDesc('saved_at'),
            Query.limit(100)
        ]);
        return result.documents as unknown as SavedMovie[];
    } catch (error) {
        console.error('Error fetching saved movies:', error);
        return undefined;
    }
}

export const isMovieSaved = async (movieId: number): Promise<boolean> => {
    try {
        if (!SAVED_COLLECTION_ID || SAVED_COLLECTION_ID === 'saved_movies') {
            console.warn('Saved movies collection not configured. Please create the collection in Appwrite.');
            return false;
        }
        const result = await database.listDocuments(DATABASE_ID, SAVED_COLLECTION_ID, [
            Query.equal('movie_id', movieId)
        ]);
        return result.documents.length > 0;
    } catch (error) {
        console.error('Error checking if movie is saved:', error);
        return false;
    }
}