import React, { useCallback, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { getSavedMovies, removeSavedMovie } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter, useFocusEffect } from "expo-router";

const Saved = () => {
  const router = useRouter();
  const isFirstRender = useRef(true);
  const {
    data: savedMovies,
    loading,
    error,
    refetch,
  } = useFetch(getSavedMovies);

  // Refresh the list when the screen comes into focus (skip first render)
  useFocusEffect(
    useCallback(() => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }
      refetch();
    }, [])
  );

  const handleRemove = async (movieId: number) => {
    const success = await removeSavedMovie(movieId);
    if (success) {
      refetch();
    }
  };

  return (
    <View className="flex-1 bg-primary">
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
      />

      <View className="w-full flex-row justify-center mt-20 items-center mb-5 px-5">
        <Image source={icons.logo} className="w-12 h-10" />
        <Text className="text-white text-2xl font-bold ml-3">Saved Movies</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" className="mt-10" />
      ) : error ? (
        <Text className="text-red-500 px-5 text-center">
          Error loading saved movies
        </Text>
      ) : !savedMovies || savedMovies.length === 0 ? (
        <View className="flex-1 justify-center items-center px-5">
          <Text className="text-gray-500 text-center text-lg">
            No saved movies yet
          </Text>
          <Text className="text-gray-400 text-center mt-2">
            Start adding movies to your collection!
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedMovies}
          renderItem={({ item }) => (
            <TouchableOpacity
              className="flex-row bg-dark-100/50 mx-5 mb-3 rounded-lg p-3"
              onPress={() => router.push(`/movies/${item.movie_id}`)}
            >
              <Image
                source={{
                  uri: item.poster_path
                    ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                    : "https://via.placehold.com/600x400/1a1a1a/ffffff.png",
                }}
                className="w-20 h-28 rounded-lg"
                resizeMode="cover"
              />
              <View className="flex-1 ml-3 justify-between">
                <View>
                  <Text
                    className="text-white font-bold text-base"
                    numberOfLines={2}
                  >
                    {item.title}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <Image source={icons.star} className="size-3" />
                    <Text className="text-white text-xs ml-1">
                      {Math.round(item.vote_average / 2)}/5
                    </Text>
                    <Text className="text-light-300 text-xs ml-2">
                      {item.release_date?.split("-")[0]}
                    </Text>
                  </View>
                  <Text
                    className="text-light-300 text-xs mt-2"
                    numberOfLines={2}
                  >
                    {item.overview}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                className="ml-2 self-start"
                onPress={(e) => {
                  e.stopPropagation();
                  handleRemove(item.movie_id);
                }}
              >
                <Image
                  source={icons.save}
                  className="size-6"
                  tintColor="#FF6B6B"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.$id}
          contentContainerStyle={{ paddingBottom: 100, paddingTop: 10 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
};

export default Saved;
