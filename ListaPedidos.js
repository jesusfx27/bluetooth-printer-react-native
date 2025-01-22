import React from 'react' 
import {Text, View, StyleSheet, ScrollView} from 'react-native' 
import GlobalStyles from './GlobalStyles'
import Pedido from './Pedido'
import Reservas from './Reservas'
 
 
const ListaPedidos = ({listaPedidos, reservas}) =>  {


    return (
        <>
        <ScrollView>
            <View style={GlobalStyles.top}>
                <Text style={GlobalStyles.header}>home</Text>
            </View>

            <View>
                <Text style={styles.label}>Pedidos</Text>
                {listaPedidos.length == 0 &&( <Text style={styles.label}>no hay pedidos aun</Text>)}
                
            </View> 
            <View> 
                {listaPedidos.length > 0 &&(listaPedidos.map(datos => (
                            <Pedido 
                            key={datos.idPedido}
                            datos= {datos}
                            listaPedidos={listaPedidos}/>)
                          ))}
            </View>
            <View>
                <Text style={styles.label}>reservas</Text>
                {reservas.length == 0 && (<Text style={styles.label}>no hay reservas</Text>)}
                
            </View>
            <View> 
                {reservas.length > 0 &&(reservas.map(datos => (
                            <Reservas 
                            key={datos.id}
                            datos= {datos}
                            reservas={reservas}/>)
                          ))}
            </View>

            </ScrollView>
        </>
)} 


const styles = StyleSheet.create({
 label: {
    fontSize: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
    marginTop: 30,
    textTransform: 'capitalize'
 }
 
 })


export default ListaPedidos;