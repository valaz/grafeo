export default {
    'en': {
        profile: {
            title: 'Profile',
            indicators: 'Indicators',
            records: 'Records'
        },
        navbar: {
            profile: 'Profile',
            logout: 'Logout',
            login: 'Login',
            signup: "Signup"
        },
        indicator: {
            create: 'Create indicator',
            edit: 'Edit indicator'
        }
    },
    'ru': {
        notification: {
            error: 'Извините, произошла ошибка. Пожалуйста, попробуйте снова!',
            logout: 'Вы успешно вышли!'
        },
        profile: {
            title: 'Профиль',
            indicators: 'Индикаторы',
            records: 'Записи',
            joined: 'Присоединился {date}'
        },
        navbar: {
            profile: 'Профиль',
            logout: 'Выйти',
            login: 'Вход',
            signup: "Регистрация"
        },
        login: {
            header: 'Вход',
            form: {
                username: {
                    placeholder: 'Логин или email',
                    error: {
                        empty: 'Пожалуйста введите логин или email'

                    }
                },
                password: {
                    placeholder: 'Пароль',
                    error: {
                        empty: 'Пожалуйста введите пароль'

                    }

                },
                submit: 'Войти',
                register: {
                    or: 'Или',
                    now: 'зарегистрируйтесь сейчас!'
                }
            },
            notification: {
                incorrect: 'Ваши логин и/или пароль неверны. Пожалуйста, попробуйте снова!',
                success: 'Вы успешно вошли!'
            }
        },
        signup: {
            header: 'Регистрация',
            form: {
                name: {
                    label: 'Полное имя',
                    placeholder: 'Ваше полное имя',
                    error: {
                        short: 'Имя слишком короткое (Минимальная длина {minLength})',
                        long: 'Имя слишком длинное (Максимальная длина {maxLength})'
                    }
                },
                username: {
                    label: 'Логин',
                    placeholder: 'Ваш уникальный Логин',
                    error: {
                        short: 'Логин слишком короткий (Минимальная длина {minLength})',
                        long: 'Логин слишком длинный (Максимальная длина {maxLength})',
                        taken: 'Этот Логин уже занят'
                    }
                },
                email: {
                    label: 'Email',
                    placeholder: 'Ваш email',
                    error: {
                        empty: 'Email не может быть пустым',
                        invalid: 'Некорректный email',
                        long: 'Email слишком длинный (Максимальная длина {maxLength})',
                        taken: 'Этот email уже занят'
                    }
                },
                password: {
                    label: 'Пароль',
                    placeholder: 'Пароль от 6 до 20 символов',
                    error: {
                        short: 'Пароль слишком короткий (Минимальная длина {minLength})',
                        long: 'Пароль слишком длинный (Максимальная длина {maxLength})',
                    }

                },
                submit: 'Зарегистрироваться',
                login: {
                    registered: 'Уже зарегистрированы?',
                    now: 'Войти сейчас!'
                }
            },
            notification: {
                success: 'Спасибо! Вы успешно зарегистрированы. Пожалуйста войдите, чтобы продолжить!',
            }

        },
        indicator: {
            create: {
                header: 'Создать Индикатор',
                placeholder: 'Введите название',
                button: 'Создать Индикатор',
                error: {
                    empty: 'Пожалуйста введите название',
                    long: 'Название слишком длинное (Допустимо {maxLength} символов)'
                },
                notification: {
                    logout: 'Пожалуйста войдите, чтобы создать индикатор'
                }
            },
            edit: {
                header: 'Обновить Индикатор',
                placeholder: 'Введите название',
                button: 'Обновать Индикатор',
                error: {
                    empty: 'Пожалуйста введите название',
                    long: 'Название слишком длинное (Допустимо {maxLength} символов)'
                },
                notification: {
                    logout: 'Пожалуйста войдите, чтобы обновить индикатор'
                }
            },
            view: {
                form: {
                    value: {
                        placeholder: 'Значение',
                        error: {
                            empty: 'Пожалуйста введите значение'
                        }
                    },
                    date: {
                        error: {
                            empty: 'Пожалуйста выберите дату'
                        }
                    },
                    submit: 'Отправить'
                },
                table: {
                    header: {
                        date: 'Дата',
                        value: 'Значение',
                        action: 'Действие'
                    }
                },
                data: {
                    empty: 'Не найдено индикаторов'
                }

            }
        }
    }
};