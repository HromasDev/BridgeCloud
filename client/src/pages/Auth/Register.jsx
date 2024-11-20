import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { registerAction } from '../../actions/user.js'
import Header from '../../components/AuthHeader/AuthHeader.jsx'
import Button from '../../components/UI/Button/Button.jsx'
import Input from '../../components/UI/Input/Input.jsx'
import useServerConnection from '../../hooks/useServerConnection'
import styles from './Auth.module.css'

const Register = () => {
	const navigate = useNavigate()
	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')

	const isServerConnected = useServerConnection()

	const handleRegister = async (e) => {
		e.preventDefault()
		const error = await registerAction(login, password)
		error ? setError(error) : navigate('/auth')
	}

	return (
		<div className={styles.Container}>
			<div className={styles.Auth}>
				<form onSubmit={handleRegister}>
					<Header
						title='Регистрация в Bridge'
						subtitle='Введите свой логин и пароль, для последующей авторизации'
					/>

					<Input
						id='login'
						placeholder='Ваш логин'
						label='Введите логин'
						setValue={setLogin}
						value={login}
						disabled={!isServerConnected}
					/>
					<Input
						id='password'
						type='password'
						placeholder='Ваш пароль'
						label='Введите пароль'
						setValue={setPassword}
						value={password}
						disabled={!isServerConnected}
					/>

					<span id='error' className='textCenter error'>
						{error}
					</span>

					{!isServerConnected && (
						<span className='textCenter error'>
							Ошибка соединения с сервером
						</span>
					)}

					<Button
						type='button'
						variant='secondary'
						onClick={() => navigate('/auth')}
					>
						УЖЕ ЗАРЕГИСТРИРОВАНЫ?
					</Button>

					<Button type='submit' disabled={!isServerConnected}>
						ЗАРЕГИСТРИРОВАТЬСЯ
					</Button>
				</form>
			</div>
			<div className={styles.AuthFooter}>
				{!isServerConnected ? (
					isServerConnected == false ? (
						<span className='textCenter error'>Сервер не доступен</span>
					) : (
						<span className='textCenter success'>Соединение с сервером...</span>
					)
				) : (
					<span className='textCenter success'>Сервер онлайн</span>
				)}
			</div>
		</div>
	)
}

export default Register
