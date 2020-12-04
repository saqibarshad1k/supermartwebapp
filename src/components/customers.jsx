import React, { Component } from 'react';
import { getOrders } from '../services/orderService';
import ShowOrder from './reuseableComps/showOrder';
import io from "socket.io-client";
import {toast} from 'react-toastify';



class Customers extends Component {

    state = {

        order: []

    }

    

    async componentDidMount(){

        const {data} =  await getOrders();
         
        this.setState({order: data})


        const socket = io("https://evening-beach-81187.herokuapp.com/apis/order/socket");

         socket.on("orderUpdate", (orderUpdate) => {

            toast.info("New Order Recieved.");
     
                  let { order } = this.state;
                  order.push(orderUpdate) 
                  this.setState({order})
    
    
  });

    }
    
    render() { 
        return ( 
        <ShowOrder orders={this.state.order}></ShowOrder>
            );
    }
}
 
export default Customers;
