import React, { useState, useEffect } from 'react';
import { Link, withRouter } from 'react-router-dom';
import Card from './Card';
import { onValue, ref } from 'firebase/database';
import { database } from '../../config/firebase';

const Main = () => {
    let user = "";
    if (localStorage.getItem("token") && localStorage.getItem("token") === "josnoc.gms@gmail.com") {
        user = "SU";
    }
    const [boxes, setBoxes] = useState([]);
    const [packets, setPackets] = useState([]);
    // let products = "";

    const renderCards = () => (
        boxes.map((box, index) => (
            <Card key={index} data={box} />
        ))
    )

    useEffect(() => {
        onValue(
            ref(database, "Boxes"),
            (Snapshot) => {
                const boxesRes = [];
                Snapshot.forEach(item => {
                    const box = {
                        id: item.key,
                        ...item.val()
                    };
                    boxesRes.push(box);
                })
                setBoxes(boxesRes);
            }, (error) => { console.log(error); }
        )
        if (user === "SU") {
            onValue(
                ref(database, "packets"),
                (Snapshot) => {
                    const packetsRes = [];
                    Snapshot.forEach(item => {
                        const packet = {
                            id: item.key,
                            ...item.val()
                        };
                        packetsRes.push(packet);
                        let products = "";
                        packet.products.forEach((product, index) => {
                            if (index > 0) { products += `\n`; }
                            products += `${product.name}-${product.quantity}`;
                        })
                        packet.products = products;
                    })
                    setPackets(packetsRes);
                }, (error) => { console.log(error); }
            )
        }
    }, []);

    const renderPackets = () => (
        packets.map((packet, index) => (
            <div key={index} className="card border-secondary mb-3 m-1">
                <div className="card-header">{packet.by}</div>
                <div className="card-body text-secondary">
                    <textarea rows={4} className='w-100' readOnly style={{ border: 'none' }}>{packet.products}</textarea>
                </div>
            </div>
        ))
    )

    return (
        <div>{user === "SU" && <div className='w-100 ps-5 mt-3'><Link to={`/add`} type="button" className="btn btn-outline-light">Añadir paquete</Link></div>}
            <div className='d-flex cols-lg-3 justify-content-center'>{renderPackets()}</div>

            <div className='row row-cols-xl-5 row-cols-lg-4 row-cols-md-2 row-cols-sm-2 row-cols-2 ps-3 pe-3 justify-content-center' id='packets_content'>
                {renderCards()}

                {/* <!-- Modal --> */}
                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                ...
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                <button type="button" className="btn btn-primary">Save changes</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Main;