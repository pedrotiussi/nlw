import React, { useEffect, useState, ChangeEvent } from 'react';
import {Link} from 'react-router-dom';
import './styles.css'; 
import logo from '../../assets/logo.svg';
import { FiArrowLeft } from 'react-icons/fi';
import {Map, TileLayer, Marker} from 'react-leaflet';
import api from '../../services/api';
import axios from 'axios';
import {LeafletMouseEvent} from 'leaflet';
 
interface Item {
    id: number;
    title: string;
    image_url: string;
}

interface IBGEUF {
    id: number;
    sigla: string;
    nome: string;
    regiao: {
      id: number;
      sigla: string;
      nome: string;
    }
}

interface IBGECity {
    id: number;
    nome: string;
    microrregiao: {
        id: number;
        nome: string;
        mesorregiao: {
            id: number;
            nome: string;
            UF: {
                id: number;
                sigla: string;
                nome: string;
                regiao: {
                    id: number;
                    sigla: string;
                    nome: string;
                }
            }
        }
    }
}

const CreatePoint = () => {
    
    const [items, setItems] = useState<Item[]>([]);  
    const [ufs, setUfs] = useState <IBGEUF[]> ([]);
    const [cities, setCities] = useState <IBGECity[]> ([]);
    const [selectedUF, setSelectedUF] = useState ('0');
    const [selectedCity, setSelectedCity] = useState ('0');
    const [selectedPosition, setSelectedPosition] = useState <[number,number]> ([0,0]); 

    useEffect(() => {
        api.get('items').then(response => {
            setItems(response.data);
        });
    }, []); 

    useEffect(()=>{
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(response => {
            setUfs(response.data); 
        });
    }, []);

    useEffect (() => {
        if (selectedUF === '0'){
            return;
        }
        axios.get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`).then(response => {
            setCities(response.data); 
        });

    }, [selectedUF]);

    function handleSelectedUF (event: ChangeEvent<HTMLSelectElement>){
        const uf = event.target.value;
        setSelectedUF(uf);
    }

    function handleSelectedCity (event: ChangeEvent <HTMLSelectElement>){
        const city = event.target.value;
        setSelectedCity(city);
    }

    function handleMapClick (event: LeafletMouseEvent){
        setSelectedPosition ([
            event.latlng.lat,
            event.latlng.lng
        ]);


    }

    return (
       <div id="page-create-point">
           <header>
               <img src={logo} alt="Ecoleta"/>
               <Link to= '/'>
                   <FiArrowLeft />
                   Voltar para home
               </Link>
            </header>

            <form>
                <h1>Cadastro do <br /> ponto de coleta</h1>

                <fieldset>
                    <legend>
                        <h2>Dados</h2>
                    </legend>

                    <div className="field">
                        <label htmlFor="name">Nome da entidade</label>
                        <input type="text" name="name" id="name"/>
                    </div>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="email">E-mail</label>
                            <input type="email" name="email" id="email"/>
                        </div>
                        <div className="field">
                            <label htmlFor="whatsapp">Whatsapp</label>
                            <input type="text" name="whatsapp" id="whatsapp"/>
                        </div>


                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Endereço</h2>
                        <span>Selecione o endereço no mapa</span>
                    </legend>

                    <Map center={[-22.9518018,-43.1844011]} zoom ={15} onClick={handleMapClick} >
                        <TileLayer
                        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        <Marker position={selectedPosition}/>

                    </Map>

                    <div className="field-group">
                        <div className="field">
                            <label htmlFor="uf">Estado(UF)</label>
                            <select name="uf" id="uf" onChange={handleSelectedUF} value={selectedUF}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option value={uf.sigla} key={uf.id}> {uf.nome} </option>   
                                ))}
                            </select>
                        </div>
                        <div className="field">
                            <label htmlFor="city">Cidade</label>
                            <select name="city" id="city">
                                <option value="0">Selecione uma cidade</option>
                                {cities.map(city => (
                                    <option value={city.nome} key={city.id}> {city.nome} </option>   
                                ))}
                            </select>
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend>
                        <h2>Ítens de coleta</h2>
                        <span>Selcione um ou mais ítens abaixo</span>
                    </legend>

                    <ul className="items-grid">
                        {items.map(item => ( 
                             <li key={item.id}>
                                <img src={item.image_url} alt={item.title}/>
                                <span>{item.title}</span>
                            </li>
                        ))}
                    </ul>

                </fieldset>

                <button type="submit">
                    Cadastrar ponto de coleta
                </button>
            </form>
           
       </div>
    );
 }
 
 export default CreatePoint;