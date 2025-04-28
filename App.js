import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ScrollView, Dimensions, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useFonts, Poppins_700Bold } from '@expo-google-fonts/poppins'

const { width } = Dimensions.get('window');

const apiKey = "a7f420376ad140f3bf73c977d9163c02"

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return <TelaInicial />;
}

function TelaInicial() {
  const [ingrediente, setIngrediente] = useState('');
  const [listaIngredientes, setListaIngredientes] = useState([]);
  const [receitas, setReceitas] = useState([]);
  const [carregando, setCarregando] = useState(false);

  const adicionarIngrediente = () => {
    if (ingrediente.trim()) {
      setListaIngredientes([...listaIngredientes, ingrediente.trim()]);
      setIngrediente('');
    }
  };

  const removerIngrediente = (index) => {
    const novaLista = [...listaIngredientes];
    novaLista.splice(index, 1);
    setListaIngredientes(novaLista);
  };

  const buscarReceitas = async () => {
    if (listaIngredientes.length === 0) {
      alert('Adicione pelo menos um ingrediente!');
      return;
    }

    setCarregando(true);

    try {
      const resposta = await fetch(`https://api.spoonacular.com/recipes/findByIngredients?ingredients=${listaIngredientes.join(',')}&number=5&apiKey=${apiKey}`);
      const dados = await resposta.json();
      setReceitas(dados);
    } catch (error) {
      console.error('Erro ao buscar receitas:', error);
      alert('Erro ao buscar receitas.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ alignItems: 'center', paddingBottom: 40 }}>
        <Text style={styles.titulo}>EasyKitchen</Text>
        <Text style={styles.subtitulo}>What you have in your kitchen becomes a recipe here.</Text>

        <View style={styles.areaFormulario}>
          <Text style={styles.label}>Enter an ingredient:</Text>

          <View style={styles.areaAdicionar}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Egg, Tomato..."
              value={ingrediente}
              onChangeText={setIngrediente}
            />
            <TouchableOpacity style={styles.botaoAdicionar} onPress={adicionarIngrediente}>
              <Text style={styles.textoBotaoAdicionar}>+ Add</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.listaIngredientes}>
            {listaIngredientes.map((item, index) => (
              <View key={index} style={styles.ingredienteItem}>
                <Text style={styles.textoIngrediente}>{item}</Text>
                <TouchableOpacity onPress={() => removerIngrediente(index)}>
                  <Ionicons name="close" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.botaoBuscarReceita} onPress={buscarReceitas}>
            <Ionicons name="search" size={20} color="#fff" />
            <Text style={styles.textoBotaoBuscarReceita}>Find recipe</Text>
          </TouchableOpacity>

          {carregando && (
            <View style={styles.areaCarregando}>
              <ActivityIndicator size="large" color="#4d6b3c" />
              <Text style={styles.textoCarregando}>Finding recipes...</Text>
            </View>
          )}

          {receitas.length > 0 && (
            <View style={{ marginTop: 20, width: '100%', alignItems: 'center' }}>
              <Text style={styles.label}>Recipes found:</Text>
              {receitas.map((receita) => (
                <View key={receita.id} style={styles.receitaItem}>
                  <Image source={{ uri: receita.image }} style={styles.receitaImagem} />
                  <Text style={styles.receitaTitulo}>{receita.title}</Text>
                </View>
              ))}
            </View>
          )}

          <Image
            source={{ uri: 'https://img.freepik.com/fotos-gratis/mulher-cozinhando-o-almoco-em-casa_1303-24175.jpg?t=st=1745773801~exp=1745777401~hmac=840f442929a99a0cf8d0bfe28d64479e0aa42c95b9bb95efb254bc8fc79b41cb&w=996' }}
            style={styles.imagem}
            resizeMode="cover"
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e3c23',
    alignItems: 'center',
    paddingTop: 50,
  },
  scroll: {
    width: '100%',
  },
  titulo: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    color: '#f2f2f2',
  },
  subtitulo: {
    fontSize: 16,
    color: '#f2f2f2',
    marginTop: 4,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  areaFormulario: {
    backgroundColor: '#f9f4ea',
    width: width * 0.9,
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  areaAdicionar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
    marginRight: 10,
  },
  botaoAdicionar: {
    backgroundColor: '#4d6b3c',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  textoBotaoAdicionar: {
    color: '#fff',
    fontWeight: 'bold',
  },
  listaIngredientes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  ingredienteItem: {
    flexDirection: 'row',
    backgroundColor: '#ffb347',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignItems: 'center',
    margin: 5,
  },
  textoIngrediente: {
    color: '#333',
    marginRight: 5,
  },
  botaoBuscarReceita: {
    flexDirection: 'row',
    backgroundColor: '#4d6b3c',
    borderRadius: 10,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 150,
  },
  textoBotaoBuscarReceita: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  imagem: {
    width: width * 0.8,
    height: width * 0.5,
    borderRadius: 20,
    marginTop: 20,
    alignSelf: 'center',
  },
  receitaItem: {
    backgroundColor: '#fafafa',
    marginBottom: 15,
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    width: width * 0.8,
  },
  receitaImagem: {
    width: '100%',
    height: 150,
  },
  receitaTitulo: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  areaCarregando: {
    marginTop: 20,
    alignItems: 'center',
  },
  textoCarregando: {
    marginTop: 10,
    color: '#4d6b3c',
    fontWeight: 'bold',
  },
});
