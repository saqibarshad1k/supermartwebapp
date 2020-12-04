import React, { Component } from 'react';

class ShowOrder extends Component {

    render() { 

        const {orders} = this.props

 return(

    <div>
        <div className="orderno">
             <h4>Current Orders: {orders.length}</h4>
        </div>
        {

            orders.map(order => 
            
                <div  className="row order">

                <div className="col-3">
                    <h5>CODE: #123ABC</h5>
                    <h6>{order.ordertime}</h6>
                </div>

                        <div className="col">
                        <div className="row">
                        <div className="col-4"> 
                         <h6>Delivery: {order.deliveryWorker.name} <br/>Phone: {order.deliveryWorker.phone}</h6>
                        </div>
                        <div className="col-4"> 
                         <h6>Store: {order.store.storeName}<br/>Phone: {order.store.phone}</h6>
                        </div>
                        <div className="col-4"> 
                         <h6>Customer:{order.customer.name}<br/>Phone: {order.customer.phone}</h6>
                        </div>
                        </div>
                        </div>
            </div>
            
            
            
            
            )}
    </div>

         
           
           
 );

          

    }
}
 
export default ShowOrder;