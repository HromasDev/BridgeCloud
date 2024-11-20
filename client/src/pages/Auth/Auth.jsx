import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginAction, registerAction } from '../../actions/user.js'
import Header from '../../components/AuthHeader/AuthHeader.jsx'
import Button from '../../components/UI/Button/Button.jsx'
import Input from '../../components/UI/Input/Input.jsx'
import useServerConnection from '../../hooks/useServerConnection.js'
import styles from './Auth.module.css'

const Auth = () => {
	const navigate = useNavigate()
	const dispatch = useDispatch()

	const [login, setLogin] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState('')
	const [isRegistering, setIsRegistering] = useState(false)

	const isServerConnected = useServerConnection()

	const handleLogin = async (e) => {
		e.preventDefault()
		try {
			await dispatch(loginAction(login, password))
			setError('')
		} catch (err) {
			setError(err.message || 'Произошла ошибка')
		}
	}

	const handleRegister = async (e) => {
		e.preventDefault()
		const error = await registerAction(login, password)
		error ? setError(error) : navigate('/auth')
	}

	const handleVKLogin = () => {
		window.location.href = `https://oauth.vk.com/authorize?client_id=51761794&display=popup&redirect_uri=${
			import.meta.env.VITE_API_URL
		}/auth/vk-auth&response_type=code&v=5.120`
	}

	return (
		<div className={styles.Container}>
			<div className={styles.Auth}>
				<form onSubmit={isRegistering ? handleRegister : handleLogin}>
					<Header
						title={isRegistering ? 'Регистрация в Bridge' : 'Войти в Bridge'}
						subtitle={
							isRegistering
								? 'Введите свой логин и пароль для регистрации'
								: 'Введите свой логин и пароль для входа'
						}
					/>

					<Input
						id='login'
						placeholder='Ваш логин'
						label='Логин'
						value={login}
						setValue={setLogin}
						disabled={!isServerConnected}
					/>
					<Input
						id='password'
						type='password'
						placeholder='Ваш пароль'
						label='Пароль'
						value={password}
						setValue={setPassword}
						disabled={!isServerConnected}
					/>

					{error && <span className='textCenter error'>{error}</span>}

					<Button
						type='button'
						variant='secondary'
						onClick={() => setIsRegistering(!isRegistering)}
					>
						{isRegistering
							? 'УЖЕ ЗАРЕГИСТРИРОВАНЫ?'
							: 'ЕЩЁ НЕ ЗАРЕГИСТРИРОВАНЫ?'}
					</Button>

					<Button type='submit' disabled={!isServerConnected}>
						{isRegistering ? 'ЗАРЕГИСТРИРОВАТЬСЯ' : 'ВОЙТИ'}
					</Button>

					{!isRegistering && (
						<Button
							variant='primary'
							type='button'
							onClick={handleVKLogin}
							disabled={!isServerConnected}
						>
							АВТОРИЗОВАТЬСЯ ПО VK ID
						</Button>
					)}
				</form>
			</div>

			<div className={styles.AuthFooter}>
				{!isServerConnected ? (
					isServerConnected === false ? (
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

export default Auth
