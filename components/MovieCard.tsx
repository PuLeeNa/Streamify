import { icons } from '@/constants/icons'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { useTheme } from "@/contexts/ThemeContext";

const MovieCard = ({ id, poster_path, title, vote_average, release_date }: Movie) => {
  const { isDark } = useTheme();
  return (
    <Link href={`/movies/${id}`} asChild>
        <TouchableOpacity className='w-[30%]'>
            <Image
                source={{ uri: poster_path
                    ? `https://image.tmdb.org/t/p/w500${poster_path}`
                    : 'https://via.placehold.com/600x400/1a1a1a/ffffff.png' }}
                    className='w-full h-52 rounded-lg'
                    resizeMode='cover'
             />

             <Text className={`${isDark ? 'text-white' : 'text-black'} text-sm font-bold mt-2`} numberOfLines={1}>{title}</Text>

                <View className="flex-row justify-start items-center gap-x-1">
                    <Image source={icons.star} className='size-4'/>
                    <Text className={`${isDark ? 'text-white' : 'text-black'} text-xs font-bold uppercase`}>{Math.round(vote_average/2)}</Text>
                </View>

                <Text className={`${isDark ? 'text-light-200' : 'text-gray-600'} text-xs font-medium mt-1`}>{release_date?.split('-')[0]}</Text>
                {/* <Text className='text-xs font-medium text-light-300 uppercase'>Movie</Text> */}
        </TouchableOpacity>
    </Link>
  )
}

export default MovieCard
