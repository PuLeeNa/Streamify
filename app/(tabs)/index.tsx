import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import TrendingCard from "@/components/TrendingCard";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies } from "@/services/api";
import { getTrendingMovies } from "@/services/appwrite";
import useFetch from "@/services/useFetch";
import { useRouter } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Text,
  View,
  Image,
  ScrollView,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from "react-native";

export default function Index() {
  const router = useRouter();
  const { isDark } = useTheme();
  const { user } = useAuth();

  const {
    data: trendingMovies,
    loading: trendingLoading,
    error: trendingError,
  } = useFetch(getTrendingMovies);

  const {
    data: movies,
    loading: moviesLoading,
    error: moviesError,
  } = useFetch(() =>
    fetchMovies({
      query: "",
    })
  );

  return (
    <View className={`flex-1 ${isDark ? "bg-primary" : "bg-white"}`}>
      <Image
        source={images.bg}
        className="absolute w-full z-0"
        style={{ opacity: isDark ? 1 : 0.05 }}
      />
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <View className="flex-row justify-between items-center mt-20 mb-5">
          <View className="flex-1" />
          <Image source={icons.logo} className="w-12 h-10" />
          <View className="flex-1 items-end">
            {user && (
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => router.push("/profile")}
                activeOpacity={0.7}
              >
                <View
                  className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${
                    isDark ? "bg-accent/20" : "bg-blue-100"
                  }`}
                >
                  <Text
                    className={`text-sm font-bold ${
                      isDark ? "text-accent" : "text-blue-500"
                    }`}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <Text
                  className={`text-sm font-semibold ${
                    isDark ? "text-white" : "text-black"
                  }`}
                  numberOfLines={1}
                >
                  {user.name || user.username}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        {moviesLoading || trendingLoading ? (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            className="mt-10 self-center"
          />
        ) : moviesError || trendingError ? (
          <Text className={isDark ? "text-red-500" : "text-red-600"}>
            Error: {moviesError?.message || trendingError?.message}
          </Text>
        ) : (
          <View className="flex-1 mt-5">
            <SearchBar
              onPress={() => router.push("/search")}
              placeholder="Search movies ..."
            />
            {trendingMovies && (
              <View className="mt-10">
                <Text
                  className={`text-lg font-bold mb-3 ${
                    isDark ? "text-white" : "text-black"
                  }`}
                >
                  Trending Movies
                </Text>
              </View>
            )}
            <>
              <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className="w-4" />}
                className="mb-4 mt-3"
                data={trendingMovies}
                renderItem={({ item, index }) => (
                  <TrendingCard movie={item} index={index} />
                )}
                keyExtractor={(item) => item.$id}
              />

              <Text
                className={`text-lg font-bold mt-5 mb-3 ${
                  isDark ? "text-white" : "text-black"
                }`}
              >
                Latest Movies
              </Text>

              <FlatList
                data={movies}
                renderItem={({ item }) => <MovieCard {...item} />}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: "flex-start",
                  gap: 20,
                  paddingRight: 5,
                  marginBottom: 10,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
