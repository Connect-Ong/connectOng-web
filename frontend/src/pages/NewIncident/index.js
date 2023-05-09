import React, { useState, useEffect } from 'react';
import './styles.css'
import logoImg from '../../assets/logo.svg';
import { Link, useHistory, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import api from '../../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function NewIncident({ query }) {

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [img_url, setURL] = useState('');
  const [sensible_content, setSensibleContent] = useState(false);
  const ongId = localStorage.getItem('ongId');
  const history = useHistory();

  let { id } = useParams();

  useEffect(() => {
    if (!id) return;

    api.get(`/incidents/${id}`, {
      headers: {
        Authorization: ongId
      }
    })
      .then(response => {

        setTitle(response.data.title);
        setDescription(response.data.description);
        setValue(response.data.value);
        setURL(response.data.img_url);
        setSensibleContent(response.data.sensible_content)

      }).catch(e => {
        alert(e)
        history.push('/profile');
      })
  }, [id, history, ongId])

  async function handleNewIncident(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      value,
      img_url,
      sensible_content,
    }
    try {
      await api.post('/incidents', data, {
        headers: {
          Authorization: ongId
        }
      })
      toast.success('Caso cadastrado com sucesso');
      history.push('/profile');
    } catch (e) {
      toast.error('Erro ao cadastrar caso, tente novamente.')
    }
  }

  async function handleUpdateIncident(e) {
    e.preventDefault();
    const data = {
      title,
      description,
      value,
      img_url,
      sensible_content,
    }
    try {
      await api.put(`/incidents/${id}`, data, {
        headers: {
          Authorization: ongId
        }
      })
      // alert('Caso atualizado com sucesso!')
      toast.success('Caso atualizado com sucesso');
      history.push('/profile');

    } catch (e) {
      toast.error('Erro ao atualizar caso, tente novamente.')
    }
  }

  return (
    <div className="new-incident-container">
      <div className="content">
        <section>
          <img src={logoImg} alt="Logo Connect ONG" />

          <h1>{id ? 'Editar Caso' : 'Cadastrar novo caso'}</h1>
          <p>Descreva o caso detalhadamente para encontrar um herói para resolver iso.</p>

          <Link className="back-link" to="/profile">
            <FiArrowLeft size={16} color="#E02041" />
            Voltar para o inicio
          </Link>
        </section>
        <form onSubmit={id ? handleUpdateIncident : handleNewIncident}>
          <input
            placeholder="Titulo do caso"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Descrição"
            value={description}
            onChange={e => setDescription(e.target.value)}
            required
          />
          <input
            placeholder="Valor em reais"
            value={value}
            onChange={e => {
              const amount = e.target.value;
              if (!amount || amount.match(/^\d{1,}(\.\d{0,2})?$/)) {
                setValue(amount);
              }
            }
            }
            required
          />
          <input
            placeholder="URL para Foto"
            value={img_url}
            onChange={e => setURL(e.target.value)}
            required
          />
          <div className="input-group">
            <input type="checkbox"
              checked={sensible_content}
              onChange={() => setSensibleContent(!sensible_content)}
            />
            <p className="checkbox__text">Conteúdo sensível</p>
          </div>


          <button className="button" type="submit">{id ? 'Atualizar' : 'Cadastrar'}</button>
          <ToastContainer />

        </form>
      </div>
    </div>
  )
}