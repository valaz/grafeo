export default {
    'en': {
        notification: {
            error: 'Sorry, some error on the server. PLease try again!',
            logout: 'You\'re successfully logged out!',
            login: 'You\'re successfully logged in!'
        },
        profile: {
            title: 'Profile',
            indicators: 'Indicators',
            records: 'Records',
            joined: 'Joined at {date}'
        },
        navbar: {
            profile: 'Profile',
            logout: 'Logout',
            login: 'Login',
            signup: "Signup",
            addIndicator: "Add Indicator"
        },
        login: {
            header: 'Login',
            form: {
                username: {
                    placeholder: 'Username or email',
                    error: {
                        empty: 'Please input your username or email!'

                    }
                },
                password: {
                    placeholder: 'Password',
                    error: {
                        empty: 'PLease enter your password'

                    }
                },
                submit: 'Login',
                register: {
                    or: 'Or',
                    now: 'register now'
                }
            },
            notification: {
                incorrect: 'Your Username or Password is incorrect. Please try again!',
                success: 'You\'re successfully logged in.'
            }
        },
        signup: {
            header: 'Signup',
            form: {
                name: {
                    label: 'Full name',
                    placeholder: 'Your full name',
                    error: {
                        short: 'Name is too short (Minimum {minLength} characters needed)',
                        long: 'Name is too long (Maximum {maxLength} characters allowed)'
                    }
                },
                username: {
                    label: 'Username',
                    placeholder: 'A unique username',
                    error: {
                        short: 'Username is too short (Minimum {minLength} characters needed)',
                        long: 'Username is too long (Maximum {maxLength} characters allowed)',
                        taken: 'This username is already taken'
                    }
                },
                email: {
                    label: 'Email',
                    placeholder: 'Your email',
                    error: {
                        empty: 'Email may not be empty',
                        invalid: 'Email not valid',
                        long: 'Email is too long (Maximum {maxLength} characters allowed)',
                        taken: 'This Email is already registered'
                    }
                },
                password: {
                    label: 'Password',
                    placeholder: 'A password between 6 to 20 characters',
                    error: {
                        short: 'Password is too short (Minimum {minLength} characters needed)',
                        long: 'Password is too long (Maximum {maxLength} characters allowed)',
                    }

                },
                submit: 'Signup',
                login: {
                    registered: 'Already registered?',
                    now: 'Login now!'
                }
            },
            notification: {
                success: 'Thank you! You\'re successfully registered. Please Login to continue!',
            }

        },
        indicatorList: {
            card: {
                lastChanged: 'Last record',
                today: 'Today'
            }
        },
        indicator: {
            create: {
                header: 'Create indicator',
                placeholder: 'Enter the name',
                button: 'Create indicator',
                error: {
                    empty: 'PLease enter a name',
                    long: 'Name is too long (Maximum {maxLength} characters allowed)'
                },
                notification: {
                    logout: 'Please Login to create indicator'
                }
            },
            edit: {
                header: 'Edit Indicator',
                placeholder: 'Enter the name',
                button: 'Edit Indicator',
                error: {
                    empty: 'PLease enter the name',
                    long: 'Name is too long (Maximum {maxLength} characters allowed)'
                },
                notification: {
                    logout: 'Please Login to edit indicator'
                }
            },
            view: {
                form: {
                    value: {
                        placeholder: 'Value',
                        error: {
                            empty: 'Please enter a value'
                        }
                    },
                    date: {
                        error: {
                            empty: 'Please select a date'
                        }
                    },
                    submit: 'Submit'
                },
                table: {
                    header: {
                        date: 'Date',
                        value: 'Value',
                        action: 'Action'
                    }
                },
                data: {
                    empty: 'No Indicators found'
                }

            }
        }

    },
    'ru': {
        notification: {
            error: 'Извините, произошла ошибка. Пожалуйста, попробуйте снова!',
            logout: 'Вы успешно вышли!',
            login: 'Вы успешно вошли!'
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
            signup: "Регистрация",
            addIndicator: "Создать индикатор"
        },
        login: {
            header: 'Вход',
            form: {
                username: {
                    placeholder: 'Логин или email',
                    error: {
                        empty: 'Пожалуйста введите Ваш логин или email'

                    }
                },
                password: {
                    placeholder: 'Пароль',
                    error: {
                        empty: 'Пожалуйста введите Ваш пароль'

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
                    placeholder: 'Уникальный Логин',
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
        indicatorList: {
            card: {
                lastChanged: 'Последняя запись',
                today: 'Сегодня'
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