import React, { useEffect, useState } from 'react'
import {Text, View, StyleSheet, ScrollView, Modal} from 'react-native'
import GlobalStyles from './GlobalStyles'
import Pedido from './Pedido'
import Reservas from './Reservas'
import NuevoPedidoDetalles from './NuevoPedidoDetalles'
import NuevoPedidoLista from './NuevoPedidoLista'
import PedidoNuevo from './PedidoNuevo'

 //<-----------------------pagina principal------------------------>



const ListaPedidos = ({listaPedidos, reservas, setListaPedidos, setReservas, onUpdateList, newOrderList, modalNuevoPedido, setModalNuevoPedido,StopSound}) =>  {

  const [modalNewOrder, setModalNewOrder] = useState(false)

  

    const handleUpdate = () =>{
        if(onUpdateList){
            onUpdateList()
        }
    }
    const EnviandoPedido = async (id) => {

        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${id}&estado=Delivery`, {
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


    const AceptarPedido = async (id) => {


        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${id}&estado=Preparando`, {
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
    const RechazarPedido = async (id) => {


        await fetch(`https://restaurant.ninjastudio.dev/api/pedidoPut.php?idPedido=${id}&estado=Rechazado`, {
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


    const AceptarReserva = async (id) => {


        await fetch(`https://restaurant.ninjastudio.dev/api/reservaPut.php?idReserva=${id}&estado=Aceptada`, {
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
    const RechazarReserva = async (id) => {


        await fetch(`https://restaurant.ninjastudio.dev/api/reservaPut.php?idReserva=${id}&estado=Rechazada`, {
            method: 'PUT', //
            data:{
                estado: "Rechazada"
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
                <Text style={GlobalStyles.header}>Chako</Text>
            </View>
            <ScrollView>

                {newOrderList.length > 0 && (<Text style={styles.label}>Nuevo Pedido</Text>)}
                {newOrderList.length > 0 &&(newOrderList.map(datos => (
                            <PedidoNuevo
                            key={datos.idPedido}
                            datos= {datos}
                            AceptarPedido={AceptarPedido}
                            RechazarPedido={RechazarPedido}
                            StopSound={StopSound}
                            />)
                          ))}
            <View>
                {listaPedidos.length > 0 &&(<Text style={styles.label}>en Preparacion</Text> )}
                {listaPedidos.length == 0 && reservas.length == 0 && newOrderList.length == 0 &&(<Text style={styles.label}>no hay pedidos aun</Text>)}

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
                
                {reservas.length > 0 && (<Text style={styles.label}>reservas</Text>)}
                
            </View>
            <View> 
                {reservas.length > 0 &&(reservas.map(datos => (
                            <Reservas 
                            key={datos.id}
                            datos= {datos}
                            reservas={reservas}
                            AceptarReserva={AceptarReserva}
                            RechazarReserva={RechazarReserva}
                            StopSound={StopSound}/>)
                          ))}
            </View>























            <View>
                    {newOrderList.length > 0 &&(
                      <Modal visible = {modalNuevoPedido}
                      animationType= 'slide'>
                        <NuevoPedidoLista
                        newOrderList={newOrderList}
                        setModalNuevoPedido= {setModalNuevoPedido}
                        reservas={reservas}
                        AceptarPedido={AceptarPedido}
                        RechazarPedido={RechazarPedido}
                        AceptarReserva={AceptarReserva}
                        RechazarReserva={RechazarReserva}

                        />
                      </Modal>
                    )}
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
                        AceptarPedido={AceptarPedido}
                        />
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