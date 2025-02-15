import React from 'react' 
import {Text, View, StyleSheet, Pressable, FlatList} from 'react-native' 
import GlobalStyles from './GlobalStyles'
 
 
const NuevoPedidoDetalles = ({setModalNewOrder, listaPedidos, AceptarPedido}) =>  {


    //<-----------logica de consultar nuevo pedido----------->
    //falta api
    const newOrder= listaPedidos[0]
    const {idPedido, nombre, nota, total} = newOrder
    

    const listaProductos= JSON.parse(newOrder.productos)


    return (
        <>
            <View style={GlobalStyles.top}>
                <Text style={GlobalStyles.header}>Nuevo Pedido</Text>
            </View>
            
                <View style={styles.contenedor}>
                    <Text style={styles.label}>Pedido #{idPedido}</Text>
                    <Text style={styles.label}>{nombre}</Text>
                    <Text style={styles.label}>Nota: {nota}</Text>



                    { <FlatList
                        data={listaProductos}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({ item }) => (
                    <View  style={styles.product}>
                        <Text style={styles.cantidad}>{item.cantidad}x {item.titulo}</Text>
                         <Text style={styles.precio}>{item.precio} €</Text>

                         
                    </View>
                   
                         
                )}
            /> }

                    <Text style={styles.total}>{total} €</Text>
                
                </View>
            

            
            <View style={styles.organizador}>
                <Pressable style={[GlobalStyles.botonOk, styles.btnSize]}
                onPress={()=> {AceptarPedido(idPedido) 
                    console.log('pedido aCeptado')
                }}>
                    <Text style= {GlobalStyles.txtOk}>Aceptar</Text>
                </Pressable>

                <Pressable style={[GlobalStyles.btncancel, styles.btnSize]}
                onPress= {()=> {setModalNewOrder(false)
                    
                }}>
                    <Text style= {GlobalStyles.txtOk}>Rechazar</Text>
                </Pressable>
            </View>
        </>
)} 


const styles = StyleSheet.create({
 contenedor: {
    backgroundColor: '#d9d9d9',
    flex: 1,
    marginVertical: 5,
    marginHorizontal: 5,
    borderRadius: 10
 },
 label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
    marginLeft: 5
 },
 organizador:{
    flexDirection: 'row',
    justifyContent: 'space-evenly'
 },
btnSize:{
    width: 100,
    // transform: [{translateY: -20}]
    marginBottom: 5
},
product:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 10
},
cantidad:{
    fontSize: 20,
    paddingVertical: 10,
    fontWeight: 'bold',
    color: '#000'
},
precio:{
    fontSize: 20,
    paddingVertical: 10,
    marginLeft: 10,
    fontWeight: 'bold',
    color: '#000'
},
total:{
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#000',
    marginLeft: '78%',
   
}
 
 })


export default NuevoPedidoDetalles;