// import { fetchMovieDetails } from '@/services/api';
// import useFetch from '@/services/useFetch';
// import { useLocalSearchParams } from 'expo-router'
// import React from 'react'
// import { View, Text, ScrollView, Image } from 'react-native'

// const MovieDetails = () => {
//   const { id } = useLocalSearchParams();

//   const { data: movie, loading} = useFetch(() => fetchMovieDetails(id as string));

//   return (
//     <View className='bg-primary flex-1'>
//       <ScrollView contentContainerStyle={{ paddingBottom: 80}}>
//         <View>
//           <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} className='w-full h-[550px]' resizeMode='stretch'/>
//         </View>
//         <View className='flex-col items-start justify-center mt-5 px-5'>
//           <Text className='text-white text-xl font-bold'>{movie?.title}</Text>
//           <Text className='text-light-300 text-sm mt-2'>{movie?.overview}</Text>
//         </View>
//       </ScrollView>
//     </View>
//   )
// }

// export default MovieDetails

import {
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useLocalSearchParams, useRouter, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "@/constants/icons";
import useFetch from "@/services/useFetch";
import { fetchMovieDetails, fetchSimilarMovies } from "@/services/api";
import MovieCard from "@/components/MovieCard";

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const MovieInfo = ({ label, value }: MovieInfoProps) => (
  <View className="flex-col items-start justify-center mt-5">
    <Text className="text-light-200 font-normal text-sm">{label}</Text>
    <Text className="text-light-100 font-bold text-sm mt-2">
      {value || "N/A"}
    </Text>
  </View>
);

const Details = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const { data: movie, loading } = useFetch(() =>
    fetchMovieDetails(id as string)
  );

  const { data: similarMovies, loading: similarLoading } = useFetch(() =>
    fetchSimilarMovies(id as string)
  );

  if (loading)
    return (
      <SafeAreaView className="bg-primary flex-1">
        <ActivityIndicator />
      </SafeAreaView>
    );

  return (
    <View className="bg-primary flex-1">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative w-full h-[550px] mb-5">
          <Image
            source={{
              uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`,
            }}
            className="w-full h-full"
            resizeMode="cover"
          />

          <TouchableOpacity className="absolute bottom-5 right-5 rounded-full size-14 bg-white flex items-center justify-center">
            <Image
              source={icons.play}
              className="w-6 h-7 ml-1"
              resizeMode="stretch"
            />
          </TouchableOpacity>
        </View>

        <View className="bg-primary px-5">
          <Text className="text-white font-bold text-xl">{movie?.title}</Text>
          <View className="flex-row items-center gap-x-1 mt-2">
            <Text className="text-light-200 text-sm">
              {movie?.release_date?.split("-")[0]} •
            </Text>
            <Text className="text-light-200 text-sm">{movie?.runtime}m</Text>
          </View>

          <View className="flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2">
            <Image source={icons.star} className="size-4" />

            <Text className="text-white font-bold text-sm">
              {Math.round(movie?.vote_average ?? 0)}/10
            </Text>

            <Text className="text-light-200 text-sm">
              ({movie?.vote_count} votes)
            </Text>
          </View>

          <MovieInfo label="Overview" value={movie?.overview} />
          <MovieInfo
            label="Genres"
            value={movie?.genres?.map((g) => g.name).join(" • ") || "N/A"}
          />

          <View className="flex flex-row justify-between w-1/2">
            <MovieInfo
              label="Budget"
              value={`$${(movie?.budget ?? 0) / 1_000_000} million`}
            />
            <MovieInfo
              label="Revenue"
              value={`$${Math.round(
                (movie?.revenue ?? 0) / 1_000_000
              )} million`}
            />
          </View>

          <MovieInfo
            label="Production Companies"
            value={
              movie?.production_companies?.map((c) => c.name).join(" • ") ||
              "N/A"
            }
          />

          {similarMovies && similarMovies.length > 0 && (
            <View className="mt-8 mb-5">
              <Text className="text-white text-lg font-bold mb-3">
                Related Movies
              </Text>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={similarMovies}
                renderItem={({ item }) => (
                  <Link href={`/movies/${item.id}`} asChild>
                    <TouchableOpacity className="w-32">
                      <Image
                        source={{
                          uri: item.poster_path
                            ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                            : "https://via.placehold.com/600x400/1a1a1a/ffffff.png",
                        }}
                        className="w-32 h-48 rounded-lg"
                        resizeMode="cover"
                      />
                      <Text
                        className="text-white text-sm font-bold mt-2 w-32"
                        numberOfLines={2}
                      >
                        {item.title}
                      </Text>
                      <View className="flex-row justify-start items-center gap-x-1">
                        <Image source={icons.star} className="size-4" />
                        <Text className="text-xs text-white font-bold uppercase">
                          {Math.round(item.vote_average / 2)}
                        </Text>
                      </View>
                      <Text className="text-xs text-light-300 font-medium mt-1">
                        {item.release_date?.split("-")[0]}
                      </Text>
                    </TouchableOpacity>
                  </Link>
                )}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className="w-4" />}
                contentContainerStyle={{ paddingRight: 20 }}
              />
            </View>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity
        className="absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50"
        onPress={router.back}
      >
        <Image
          source={icons.arrow}
          className="size-5 mr-1 mt-0.5 rotate-180"
          tintColor="#fff"
        />
        <Text className="text-white font-semibold text-base">Go Back</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Details;
