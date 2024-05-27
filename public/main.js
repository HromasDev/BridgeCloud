document.addEventListener('DOMContentLoaded', function () {
    const usernameInput = document.getElementById('username');
    if (usernameInput) {
        usernameInput.addEventListener('change', function () {
            fetch('/update-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.value
                })
            });
        });
    }

    const photoInput = document.getElementById('photoInput');
    if (photoInput) {
        photoInput.addEventListener('change', function () {
            var file = this.files[0];
            if (file) {
                var reader = new FileReader();
                reader.onload = function (e) {
                    fetch('/update-photo', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            photo: e.target.result
                        })
                    }).then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    }).then(data => {
                        const photoElement = document.getElementById('photo');
                        if (photoElement) {
                            photoElement.src = data.photo;
                        }
                    }).catch(error => {
                        console.error('There was a problem with your fetch operation:', error);
                    });
                };
                reader.readAsDataURL(file);
            }
        });
    }

    const changePasswordForm = document.querySelector('#change-password');
    if (changePasswordForm) {
        changePasswordForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const login = document.querySelector("#login").value,
                old_password = document.querySelector("#old-password").value,
                new_password = document.querySelector("#new-password").value,
                error = document.querySelector("#password-error"),
                message = document.querySelector("#password-message");

            fetch('/update-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    login: login,
                    old_password: old_password,
                    new_password: new_password
                })
            }).then(response => response.json())
                .then(data => {
                    if (data.error) {
                        message.innerHTML = '';
                        error.innerHTML = data.error;
                    }
                    if (data.message) {
                        error.innerHTML = '';
                        message.innerHTML = data.message;
                    }
                });
        });
    }
});

function changeSettings() {
    const fa = document.querySelector("#fa").checked ? 1 : 0,
        remote_control = document.querySelector("#remote-control").checked ? 1 : 0,
        auth_notify = document.querySelector("#auth-notify").checked ? 1 : 0;

    fetch('/change-settings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fa: fa,
            remote_control: remote_control,
            auth_notify: auth_notify
        })

    }).then(response => response.json())
        .then(data => {
            console.log(data);
        })
        .catch(error => console.error(error));
}
