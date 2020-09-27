import React, {useState, useEffect} from 'react';
import { Image,  StyleSheet, Text, View, ActivityIndicator, FlatList } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { TouchableHighlight } from 'react-native-gesture-handler';


const Stack = createStackNavigator();

//Главная ф-ция
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" 
        
        component={HomeScreen}
        options={{title:'Gallery'}}/>
        <Stack.Screen options={{headerShown:false}} name="Photo" component={PhotoScreen}/>
        </Stack.Navigator>    
    </NavigationContainer>
  );
}
//Главный экран
const HomeScreen =({navigation}) =>{
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  //Получение изображений с unsplash.com
  useEffect(() => {
    fetch('https://api.unsplash.com/search/photos.json/?client_id=cf49c08b444ff4cb9e4d126b7e9f7513ba1ee58de7906e4360afc1a33d1bf4c0&query=dogs')
      .then((response) => response.json())
      .then((json) => setData(json.results))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false));
  }, []);
  return(
    <View>
      {isLoading ? <ActivityIndicator/> : (
        <FlatList
          data={data}
          keyExtractor={({ id }, index) => id}
          renderItem={({ item }) => (
            <View style={styles.container}>
              {/* Вывести увеличенную фотографию */}
          <TouchableHighlight onPress={() =>
            navigation.navigate('Photo', { imageLink: item.urls.small })} >
            <Image style={styles.tiny_image} source={{uri:item.urls.small}}/>
          </TouchableHighlight>
          {/* Информация о фотографии */}
          <View style={styles.description}>
          <Text > Description: {item.description} </Text>         
          <Text > Author: {item.user.username}</Text>
          </View>
          </View>
          )}
        />
      )}
    </View>
  );
}
//Экран с фотографией
const PhotoScreen = ({route, navigation}) =>{
  const {imageLink} = route.params;
  return (
    <Image style={styles.full_image} source={{uri:imageLink}}/>
  )
}

//Стили
const styles = StyleSheet.create({
  container: {
    flex:1,
    flexDirection:'row',
    padding: 5,
    margin: 5,
  },
  description:{
    width: 130, marginLeft:10
  },
  full_image:{
    height: 500,
    resizeMode:'contain'
  },
  tiny_image:{
    marginTop: 5,
    marginBottom: 5,
    height: 200,
    width: 180
  },
});
