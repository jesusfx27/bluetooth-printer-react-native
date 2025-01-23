import React, { useState } from 'react' 
import {Text, View, StyleSheet, ScrollView, Modal} from 'react-native' 
import GlobalStyles from './GlobalStyles'
import Pedido from './Pedido'
import Reservas from './Reservas'
import NuevoPedido from './NuevoPedido'
 
 //<-----------------------pagina principal------------------------>



const ListaPedidos = ({listaPedidos, reservas, setListaPedidos, setReservas, onUpdateList}) =>  {
    
  const [modalNewOrder, setModalNewOrder] = useState(false)

    const handleUpdate = () =>{
        if(onUpdateList){
            onUpdateList()
        }
    }

    

    const AceptarPedido = async () => {
   

        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${idPedido}`, {
            method: 'PUT', //
            data:{
                estado: "Preparando"
            }
        })
            .then(response => response.json())
            .then(data => {
               //aqui llamamos a imprimir
            })
            .catch(error => console.error('Error al cambiar el estado:', error));
    };

    return (
        <>
        
            <View style={GlobalStyles.top}>
                <Text style={GlobalStyles.header}>home</Text>
            </View>
            <ScrollView>
            <View>
                <Text style={styles.label}>Preparando</Text>
                {listaPedidos.length == 0 &&( <Text style={styles.label}>no hay pedidos aun</Text>)}
                
            </View> 
            <View> 
                {listaPedidos.length > 0 &&(listaPedidos.map(datos => (
                            <Pedido 
                            key={datos.idPedido}
                            datos= {datos}
                            onUpdateList={handleUpdate}/>)
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

            <View>
                {modalNewOrder && (
                    <Modal
                    visible= {modalNewOrder}
                    animationType= 'slide'>
                        <NuevoPedido 
                        setModalNewOrder={setModalNewOrder}
                        listaPedidos={listaPedidos}/>
                    </Modal>
                )}
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
    textTransform: 'capitalize',
    marginBottom: 20
 }
 
 })


export default ListaPedidos;