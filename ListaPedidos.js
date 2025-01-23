import React, { useState } from 'react' 
import {Text, View, StyleSheet, ScrollView, Modal} from 'react-native' 
import GlobalStyles from './GlobalStyles'
import Pedido from './Pedido'
import Reservas from './Reservas'
import NuevoPedidoDetalles from './NuevoPedidoDetalles'
import NuevoPedidoLista from './NuevoPedidoLista'
 
 //<-----------------------pagina principal------------------------>



const ListaPedidos = ({listaPedidos, reservas, setListaPedidos, setReservas, onUpdateList, newOrderList, modalNuevoPedido, setModalNuevoPedido}) =>  {
    
  const [modalNewOrder, setModalNewOrder] = useState(false)
  const [orderId, setOrderId] = useState('')

    const handleUpdate = () =>{
        if(onUpdateList){
            onUpdateList()
        }
    }
    const EnviandoPedido = async () => {

        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${orderId}&estado=Delivery`, {
            method: 'PUT', //
            data:{
                estado: "Delivery"
            }
        })
            .then(response => response.json())
            .then(data => {
               //aqui llamamos a imprimir
               handleUpdate()
            })
            .catch(error => console.error('Error al cambiar el estado:', error));
    };
    

    const AceptarPedido = async () => {
   

        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${orderId}&estado=Preparando`, {
            method: 'PUT', //
            data:{
                estado: "Preparando"
            }
        })
            .then(response => response.json())
            .then(data => {
               //aqui llamamos a imprimir
               handleUpdate()
            })
            .catch(error => console.error('Error al cambiar el estado:', error));
    };
    const RechazarPedido = async () => {
   

        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${orderId}&estado=Rechazado`, {
            method: 'PUT', //
            data:{
                estado: "Preparando"
            }
        })
            .then(response => response.json())
            .then(data => {
               //aqui llamamos a imprimir
               handleUpdate()
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
                <Text style={styles.label}>en Preparacion</Text>
                {listaPedidos.length == 0 &&( <Text style={styles.label}>no hay pedidos aun</Text>)}
                
            </View> 
            <View> 
                {listaPedidos.length > 0 &&(listaPedidos.map(datos => (
                            <Pedido 
                            key={datos.idPedido}
                            datos= {datos}
                            onUpdateList={handleUpdate}
                            EnviandoPedido={EnviandoPedido}
                            />)
                          ))}
            </View>
            <View>
                    {newOrderList.length > 0 &&(
                      <Modal visible = {true}
                      animationType= 'slide'>
                        <NuevoPedidoLista
                        newOrderList={newOrderList}
                        setModalNuevoPedido= {setModalNuevoPedido}
                        reservas={reservas}
                        setOrderId={setOrderId}
                        AceptarPedido={AceptarPedido}
                        RechazarPedido={RechazarPedido}
                        />
                      </Modal>
                    )}
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
                        <NuevoPedidoDetalles
                        setModalNewOrder={setModalNewOrder}
                        listaPedidos={listaPedidos}
                        setOrderId={setOrderId}
                        AceptarPedido={AceptarPedido}/>
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