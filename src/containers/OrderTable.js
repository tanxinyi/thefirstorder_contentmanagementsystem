import React, { Component } from "react";
import axios from "axios";
import {Button, Tab, Table, Tabs} from "react-bootstrap";
import DisplayCustomerOrder from "./DisplayCustomerOrder";
// import DisplayNotification from "./DisplayNotification";
import Notifications, {notify} from 'react-notify-toast';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AcknowledgeOrder from "./AcknowledgeOrder";
import has from 'lodash/has';
import DisplayCustomerOrderList from "./DisplayCustomerOrderList";

class OrderTable extends Component {

    constructor(props){
        super(props);
        this.state={
            sentOrderData: [],
            sentOrderData1: [],
            dataLength: '',
            dataLength1: '',
            acknowledgedOrderData: [],
            updateAcknowledgedOrders: false,
            managerName: ''
        };
        this.check = this.check.bind(this);
        this.getSentOrders = this.getSentOrders.bind(this);
        this.getSentOrders1 = this.getSentOrders1.bind(this);
        this.getAcknowledgedOrders = this.getAcknowledgedOrders.bind(this);
        this.handleAcknowledgedOrderUpdate = this.handleAcknowledgedOrderUpdate.bind(this);
    }

    componentWillMount() {
        this.getSentOrders(this);
        this.getAcknowledgedOrders(this);
    }

    componentDidMount(){
        this.interval = setInterval(() => this.getSentOrders1(this), 5000);
    }

    componentDidUpdate() {
        if (this.state.updateAcknowledgedOrders === true) {
            this.getSentOrders(this);
            this.getAcknowledgedOrders(this);
            this.setState({
                updateAcknowledgedOrders: false,
                dataLength: '',
                dataLength1: ''
            });
        }
        else if (this.state.dataLength1) {
            if (JSON.stringify(this.state.sentOrderData) !== JSON.stringify(this.state.sentOrderData1)) {
                if (this.state.dataLength === this.state.dataLength1) {
                    this.getSentOrders(this);
                    this.getSentOrders1(this);
                    this.getAcknowledgedOrders(this);
                }else if(this.state.dataLength !== this.state.dataLength1){
                    // notify.show("New Order Received!", "success");
                    this.notify();
                    this.getSentOrders(this);
                    this.getAcknowledgedOrders(this);
                    this.setState({
                        updateAcknowledgedOrders: false,
                        dataLength: this.state.dataLength1
                    });
                }
            }
            // if(this.state.dataLength !== this.state.dataLength1){
            //     // notify.show("New Order Received!", "success");
            //     this.notify();
            //     this.getSentOrders(this);
            //     this.getAcknowledgedOrders(this);
            //     this.setState({
            //         dataLength: this.state.dataLength1
            //     });
            // }
            // }else if(JSON.stringify(this.state.sentOrderData !== JSON.stringify(this.state.sentOrderData1))){
            //     this.getSentOrders(this);
            // }
            // else if(this.state.dataLength === this.state.dataLength1){
            //     if(this.state.updatePaymentStatus === true){
            //         this.getSentOrders(this);
            //         this.setState({
            //             updatePaymentStatus: false
            //         });
            //     }
            // }
        }
    }

    notify = () => {
        toast("New Order Received!");
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getSentOrders(ev){
        axios.get('http://makanow.herokuapp.com/api/orders/restaurant/'+this.props.selectedRestaurant+'/retrieve_sent_orders/')
            .then(function(response) {
                ev.setState({
                    sentOrderData: response.data,
                    dataLength: response.data.length
                });
            });
    }

    getSentOrders1(ev){
        axios.get('http://makanow.herokuapp.com/api/orders/restaurant/'+this.props.selectedRestaurant+'/retrieve_sent_orders/')
            .then(function(response) {
                ev.setState({
                    sentOrderData1: response.data,
                    dataLength1: response.data.length
                });
            });
    }

    getAcknowledgedOrders(ev){
        axios.get('http://makanow.herokuapp.com/api/orders/restaurant/'+this.props.selectedRestaurant+'/retrieve_acknowledged_orders/')
            .then(function(response) {
                ev.setState({
                    acknowledgedOrderData: response.data,
                });
            });
    }

    handleAcknowledgedOrderUpdate(){
        this.setState({
            updateAcknowledgedOrders: true
        })
    }

    displayPaymentStatus(paymentStatus){
        if(paymentStatus === "READY"){
            return(
                <text align="center" style={{color:"green"}}><b>{paymentStatus}</b></text>
            )
        }else{
            return(
                <text align="center" style={{color:"red"}}><b>{paymentStatus}</b></text>
            )
        }
    }

    check(){
        console.log(this.state.sentOrderData);
    }

    render(){
        if(this.state.sentOrderData.length === 0){
            return(
                <div>
                    {/*<Notifications options={{zIndex: 200, top: '50px'}}/>*/}
                    <ToastContainer position="top-right"
                                    autoClose={10000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnVisibilityChange
                                    draggable/>
                    {/*<DisplayNotification pendingOrderData={this.state.pendingOrderData} selectedRestaurant={this.props.selectedRestaurant}/>*/}
                    <br/>
                    <p><h3><b>New Orders: </b></h3></p>
                    <Table striped condensed hover>
                        <thead>
                            <tr>
                                <th align="center">No New Orders</th>
                            </tr>
                        </thead>
                    </Table>
                    <p><h3><b>Acknowledged Orders: </b></h3></p>
                    <Table striped condensed hover>
                        <thead>
                        <tr>
                            <th align="center">S/N</th>
                            <th align="center">Table No:</th>
                            <th align="center">Order ID:</th>
                            <th align="center">Order Summary:</th>
                            <th align="center">Subtotal:</th>
                            <th align="center">Mode of Payment:</th>
                            <th align="center">Payment Status:</th>
                            <th align="center">Date & Time:</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.acknowledgedOrderData.map((acknowledgedOrder, k) =>
                            <tr index={k}>
                                <td align="left">{k+1}</td>
                                <td align="left">{acknowledgedOrder.seatingTable.qrCode}</td>
                                <td align="left">{acknowledgedOrder.orderId}</td>
                                <DisplayCustomerOrder orderId={acknowledgedOrder.orderId}/>
                                <td align="left">S${acknowledgedOrder.totalAmount}</td>
                                <td align="left">{acknowledgedOrder.modeOfPayment}</td>
                                <td align="left">{acknowledgedOrder.paymentStatus}</td>
                                <td align="left">{new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(acknowledgedOrder.orderDate))}</td>
                            </tr>
                        )
                        }
                        </tbody>
                    </Table>
                    {/*<button onClick={this.check}>Check</button>*/}
                </div>
            )
        }else{
            return(
                <div>
                    {/*<Notifications options={{zIndex: 200, top: '30px'}}/>*/}
                    <ToastContainer position="top-right"
                                    autoClose={10000}
                                    hideProgressBar={false}
                                    newestOnTop={false}
                                    closeOnClick
                                    rtl={false}
                                    pauseOnVisibilityChange
                                    draggable/>
                    {/*<DisplayNotification pendingOrderData={this.state.pendingOrderData} selectedRestaurant={this.props.selectedRestaurant}/>*/}
                    <br/>
                    <p><h3><b>New Orders: </b></h3></p>
                    <Table striped condensed hover>
                        <thead>
                        <tr>
                            <th align="center">S/N</th>
                            <th align="center">Table No:</th>
                            <th align="center">Order ID:</th>
                            <th align="center">Order Summary:</th>
                            <th align="center">Subtotal:</th>
                            {/*<th align="center">Mode of Payment:</th>*/}
                            <th align="center">Payment Status:</th>
                            <th align="center">Date & Time:</th>
                            <th align="center">Cancel / Acknowledge:</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.sentOrderData.map((sentOrder, k) =>
                            <tr index={k}>
                                <td align="left">{k+1}</td>
                                <td align="left">{sentOrder.seatingTable.qrCode}</td>
                                <td align="left">{sentOrder.orderId}</td>
                                <DisplayCustomerOrderList orderId={sentOrder.orderId} updateAcknowledgedOrders={this.state.updateAcknowledgedOrders} handleAcknowledgedOrderUpdate={this.handleAcknowledgedOrderUpdate}/>
                                <td align="left">S${sentOrder.totalAmount}</td>
                                {/*<td align="left">{sentOrder.orderSummary.modeOfPayment}</td>*/}
                                <td>{this.displayPaymentStatus(sentOrder.paymentStatus)}</td>
                                <td align="left">{new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(sentOrder.orderDate))}</td>
                                <td align="center"><AcknowledgeOrder restaurantId={this.props.selectedRestaurant} orderId={sentOrder.orderId} handleAcknowledgedOrderUpdate={this.handleAcknowledgedOrderUpdate} restaurant={this.props.restaurant} sentOrder={sentOrder}/></td>
                            </tr>
                        )
                        }
                        </tbody>
                    </Table>
                    <hr/>
                    <p><h3><b>Acknowledged Orders: </b></h3></p>
                    <Table striped condensed hover>
                        <thead>
                        <tr>
                            <th align="center">S/N</th>
                            <th align="center">Table No:</th>
                            <th align="center">Order ID:</th>
                            <th align="center">Order Summary:</th>
                            <th align="center">Subtotal:</th>
                            <th align="center">Mode of Payment:</th>
                            <th align="center">Payment Status:</th>
                            <th align="center">Date & Time:</th>
                        </tr>
                        </thead>
                        <tbody>
                        {this.state.acknowledgedOrderData.map((acknowledgedOrder, k) =>
                            <tr index={k}>
                                <td align="left">{k+1}</td>
                                <td align="left">{acknowledgedOrder.seatingTable.qrCode}</td>
                                <td align="left">{acknowledgedOrder.orderId}</td>
                                <DisplayCustomerOrder orderId={acknowledgedOrder.orderId}/>
                                <td align="left">S${acknowledgedOrder.totalAmount}</td>
                                <td align="left">{acknowledgedOrder.modeOfPayment}</td>
                                <td align="left">{acknowledgedOrder.paymentStatus}</td>
                                <td align="left">{new Intl.DateTimeFormat('en-GB', {year: 'numeric', month: 'long',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(new Date(acknowledgedOrder.orderDate))}</td>
                                </tr>
                        )
                        }
                        </tbody>
                    </Table>
                    {/*<button onClick={this.check}>Check</button>*/}
                </div>
            )
         }
    }
}
export default OrderTable;