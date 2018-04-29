export default {
    'en': {
        error: {
            notFound: 'The Page you\'re looking for was not found.',
            serverError: 'Oops! Something went wrong at our Server. Why don\'t you go back?',
            goBack: 'Go back'
        },
        notification: {
            error: 'Sorry, some error on the server. PLease try again!',
            logout: 'You\'re successfully logged out!',
            login: 'You\'re successfully logged in!'
        },
        profile: {
            title: 'Profile',
            indicators: 'Indicators',
            records: 'Records',
            joined: 'Joined at {date}',
            edit: {
                title: 'Edit profile',
                header: 'Edit profile',
                submit: 'Save'
            }
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
                passwordConfirm: {
                    label: 'Password confirm',
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
                today: 'Today',
                yesterday: 'Yesterday',
                noData: 'No records'
            }
        },
        indicator: {
            config: {
                form: {
                    name: {
                        label: 'Name',
                        placeholder: 'Enter the name',
                        error: {
                            empty: 'PLease enter a name',
                            long: 'Name is too long (Maximum {maxLength} characters allowed)'
                        },
                    },
                    unit: {
                        label: 'Unit name',
                        placeholder: 'Enter the unit name',
                        error: {
                            empty: 'PLease enter unit name',
                            long: 'Unit name is too long (Maximum {maxLength} characters allowed)'
                        },
                    },
                    button: {
                        create: 'Create indicator',
                        edit: 'Edit Indicator',
                    },

                },
                header: {
                    create: 'Create indicator',
                    edit: 'Edit Indicator',
                },
                notification: {
                    logout: 'Please Login to continue'
                }
            },
            view: {
                form: {
                    value: {
                        placeholder: 'Value',
                        error: {
                            empty: 'Please enter a value',
                            long: 'Value is too long',
                        }
                    },
                    date: {
                        placeholder: 'Date',
                        today: 'today',
                        cancel: 'cancel',
                        ok: 'ok',
                        error: {
                            empty: 'Please select a date'
                        }
                    },
                    submit: 'Submit'
                },
                card: {
                    edit: {
                        menu: 'Edit'
                    },
                    delete: {
                        menu: 'Delete',
                        dialog: {
                            title: 'Do you really want to delete indicator?',
                            description: 'This action can not be undone',
                            cancel: 'Cancel',
                            delete: 'Delete'
                        }
                    }
                },
                table: {
                    header: {
                        date: 'Date',
                        value: 'Value',
                        action: 'Action'
                    },
                    rowsPerPage: 'Rows per page:',
                    of: 'of'
                },
                chart: {
                    form: {
                        select: {
                            all: 'All',
                            year: 'Year',
                            month: 'Month',
                            week: 'Week',
                        },
                        control: {
                            left: 'From period start',
                            right: 'Until today',
                        }
                    }
                },
                data: {
                    empty: 'No Indicators found',
                },
                record: {
                    deleted: 'Record deleted successfully'
                }

            }
        }

    },
    'ru': {
        error: {
            notFound: 'Страница, которую Вы ищете не существует',
            serverError: 'Извините, произошла ошибка на сервере. Почему бы Вам не вернуться назад?',
            goBack: 'Назад'
        },
        notification: {
            error: 'Извините, произошла ошибка. Пожалуйста, попробуйте снова!',
            logout: 'Вы успешно вышли!',
            login: 'Вы успешно вошли!'
        },
        profile: {
            title: 'Профиль',
            indicators: 'Индикаторы',
            records: 'Записи',
            joined: 'Присоединился {date}',
            edit: {
                title: 'Изменить профиль',
                header: 'Изменить профиль',
                submit: 'Сохранить'
            }
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
                passwordConfirm: {
                    label: 'Подтверждение пароля',
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
                today: 'Сегодня',
                yesterday: 'Вчера',
                noData: 'Нет записей'
            }
        },
        indicator: {
            config: {
                form: {
                    name: {
                        label: 'Название',
                        placeholder: 'Введите название',
                        error: {
                            empty: 'Пожалуйста введите название',
                            long: 'Название слишком длинное (Максимальная длина {maxLength})'
                        },
                    },
                    unit: {
                        label: 'Единица измерения',
                        placeholder: 'Введите единицу измерения',
                        error: {
                            empty: 'Пожалуйста единицу измерения',
                            long: 'Значение слишком длинное (Максимальная длина {maxLength})'
                        },
                    },
                    button: {
                        create: 'Создать Индикатор',
                        edit: 'Обновить Индикатор',
                    },

                },
                header: {
                    create: 'Создать Индикатор',
                    edit: 'Обновить Индикатор',
                },
                notification: {
                    logout: 'Пожалуйста войдите, чтобы продолжить'
                }
            },
            view: {
                form: {
                    value: {
                        placeholder: 'Значение',
                        error: {
                            empty: 'Пожалуйста введите значение',
                            long: 'Слишком большое значение',
                        }
                    },
                    date: {
                        placeholder: 'Дата',
                        today: 'сегодня',
                        cancel: 'отменить',
                        ok: 'ок',
                        error: {
                            empty: 'Пожалуйста выберите дату'
                        }
                    },
                    submit: 'Отправить'
                },
                card: {
                    edit: {
                        menu: 'Изменить'
                    },
                    delete: {
                        menu: 'Удалить',
                        dialog: {
                            title: 'Вы действительно хотите удалить индикатор?',
                            description: 'Это действие будет невозможно отменить',
                            cancel: 'Отмена',
                            delete: 'Удалить'
                        }
                    }
                },
                table: {
                    header: {
                        date: 'Дата',
                        value: 'Значение',
                        action: 'Действие'
                    },
                    rowsPerPage: 'Строк на странице:',
                    of: 'из'
                },
                chart: {
                    form: {
                        select: {
                            all: 'Все',
                            year: 'Год',
                            month: 'Месяц',
                            week: 'Неделя',
                        },
                        control: {
                            left: 'От начала периода',
                            right: 'До сегодняшнего дня',
                        }
                    }
                },
                data: {
                    empty: 'Не найдено индикаторов'
                },
                record: {
                    deleted: 'Запись успешно удалена'
                }
            }
        }
    }
};