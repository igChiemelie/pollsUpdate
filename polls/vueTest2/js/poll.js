let app = new Vue({
    el: '#app',
    data() {
        return {
            // Poll Voting System: 😜😢🤢

            polls: [],
            user: [],
            newUser: [],

            // Poll Insert Form
            topic: '',
            title: '',
            optionA: '',
            optionB: '',

            // Poll ID
            pollId: [],
            // Poll toggle btn
            toggle: [],

            // Single user outputs
            obtained: true,
            userPollRes: [],
            obtainedDel: '',
            userId: '',
            singleUserLengthResult: '',
            restoredUserLengthResult: '',

            // Admin authentication
            adminCheck: '',
            admin: '',
            DisplayNoUserMsg: '',

            // Gender authentication
            checkGender: '',
            gender: '',

            // Restored User Check
            obtainedUser: '',

            allUsers: [],
            singleUser: [],

            // Display User's Login Inputs
            email: '',
            pass: '',

            // Display User's Registration Inputs
            fName: '',
            lName: '',
            oName: '',
            gender: '', 
            regEmail: '',
            username: '',
            phone: '',
            regPass: '',
            cRegPass: '',

            // Profile Update
            upUserFname: '',
            upUserLName: '',
            upUserEmail: '',
            upUserPhone: '',
            uploadImg: '',

            // Profile Response
            profileUserPolls: [],

            // Footer 
            newDate: new Date(),
            profileUser: [],
            test: [],
            

            //image validation
            userImage : '',
            image: '',

        }
    },
    computed: {
        
    },
    mounted() {
        this.getAllPolls();
        this.userAuth();
        this.getSocket();
        this.getAllUsers();
        this.restoreUser();
        this.getSocketToggleButton();
        this.getUserUpdatedProfile();
    },
    methods: {
        getSocket() {
            socket.on("connect", () => {
                console.log('connected');

                // socket.emit('getCoinData', {});

                socket.on('connected', (data) => {
                    console.log(data);
                });

                socket.on('votes', (data) => {
                    this.polls.forEach(el => {
                        if (data._id === el._id) {
                            el.optionAVoters = data.optionAVoters;
                            el.optionBVoters = data.optionBVoters;
                        }
                    });
                });
            });
        },
        register() {
            let regData = {
                firstname: this.fName,
                lastname: this.lName,
                othername: this.oName,
                gender: this.gender,
                email: this.regEmail,
                username: this.username,
                phone: this.phone,
                password: this.regPass,
                cPassword: this.cRegPass
            }

            this.fName = [],
            this.lName = [],
            this.oName = [],
            this.gender = [],
            this.regEmail = [],
            this.username = [],
            this.phone = [],
            this.regPass = [],
            this.cRegPass = []

            axios.post(appURL + "/register", regData)
            .then(res => {
                console.log(res);
                this.newUser = res.data.newUser
                console.log(this.newUser);

            }).catch(err => {
                console.log(err);

            });
        },
        login() {
            let logData = {
                email: this.email,
                password: this.pass
            }
            this.email = [],
                this.pass = []

            axios.post(appURL + "/login", logData)
                .then(res => {
                    this.user = res.data.user;
                    this.gender = res.data.user.gender;

                    window.localStorage.setItem('user', JSON.stringify(res.data.user));
                    window.localStorage.setItem('admin', JSON.stringify(res.data.user.userType));
                    window.localStorage.setItem('gender', JSON.stringify(res.data.user.gender));
                    window.localStorage.setItem('updateUserProfile', JSON.stringify(res.data.user._id));

                    Swal.fire({
                        icon: 'success',
                        title: 'User Logged In Successfully!',
                        text: 'You can now make a poll request',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                }).catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error Alert!',
                        text: 'Put your login details properly, but if the error persist, contact your admin.',
                        showConfirmButton: false,
                        timer: 5000
                    });
                    $('#modal1').modal('close');

                });
        },
        userAuth() {
            let user = JSON.parse(window.localStorage.getItem('user'));
            let check = (user) ? 'yes' : 'no';//tenary statement
            this.user = user;

            this.adminCheck = JSON.parse(window.localStorage.getItem('admin'));
            this.admin = 'admin';

            this.checkGender = JSON.parse(window.localStorage.getItem('gender'));
            this.gender = 'M';

        },
        getAllUsers() {
            axios.get(appURL + "/allUsers")
                .then(res => {
                    this.allUsers = res.data.users.user;
                    let showNoUserMsg = res.data.users.user.length;
                    if (showNoUserMsg < 1) {
                        this.DisplayNoUserMsg = 'User not found in the Database';
                    }

                }).catch(err => {

                    console.log(err);
                });
        },
        addNewPoll() {
            let pollSubmit = {
                topic: this.topic,
                title: this.title,
                optionA: this.optionA,
                optionB: this.optionB
            }
            axios.post(appURL + "/polls/add", pollSubmit)
                .then(res => {
                    // console.log(res);
                    Swal.fire({
                        icon: 'success',
                        title: 'New Poll Alert!',
                        text: 'Poll has been added Successfully!',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    setTimeout(() => {
                        window.location.href = "../index.html";
                    }, 3000);
                }).catch(err => {
                    console.log(err);
                })
        },
        deletePoll(pollId) {
            Swal.fire({
                title: 'DELETE Poll?',
                text: 'Are you sure you want to delete this Poll?',
                icon: 'warning',
                iconColor: 'red',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            }).then((res) => {
                if (res.isConfirmed) {
                    this.deletedPoll(pollId);
                }
            });
        },
        deletedPoll(pollId) {
            let pollToDelete = {
                pollId: pollId
            }
            axios.patch(appURL + "/polls/poll/delete/:id", pollToDelete)
                .then(res => {
                    // console.log(res);
                    Swal.fire({
                        icon: 'success',
                        title: 'poll has been deleted Successfully!',
                        showConfirmButton: false,
                        timer: 3000
                    });

                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                }).catch(err => {
                    console.log(err);
                });
        },
        getAllPolls() {
            axios.get(appURL + "/polls/all")
                .then(res => {
                    console.log(res);

                    // For Index-Page Section 
                    res.data.poll.forEach(el => {
                        this.polls.push(el);
                    });

                    // For Profile-Page Section 
                    let userId = this.user._id;
                    // let userId =  this.user;

                    console.log(userId + 'here now');

                    res.data.poll.forEach(el => {

                        let profileUserOptionA = el.optionAVoters.includes(userId);
                        let profileUserOptionB = el.optionBVoters.includes(userId);

                        if (profileUserOptionA) {
                            this.profileUserPolls.push({ title: el.title, option: el.optionA });

                        } else if (profileUserOptionB) {

                            this.profileUserPolls.push({ title: el.title, option: el.optionB });
                        }
                    });

                }).catch(err => {
                    console.log(err);
                });
        },
        response(option, pollId) {
            this.pollId = pollId;
            let resAction = {
                userAns: option,
                userId: this.user._id,
                pollId: pollId
            }
            // socket.emit('castVote', resAction);
            // Axios
            axios.patch(appURL + '/polls/poll/:id', resAction)
                .then(res => {
                    // console.log(res);
                }).catch(err => {
                    console.log(err);
                })
        },
        obtain(userClicked) {
            let clicked = {
                userIdPass: userClicked
            }
            this.userId = userClicked;
            this.userPollRes = [];

            axios.post(appURL + '/singleUser', clicked)
                .then(res => {

                    this.singleUser = res.data.singleUser.single;

                    this.singleUserLengthResult = res.data.singleUser.single.length;

                    res.data.singleUser.single.forEach(el => {

                        let optionACheck = el.optionAVoters.includes(userClicked);
                        let optionBCheck = el.optionBVoters.includes(userClicked);

                        if (optionACheck) {
                            this.userPollRes.push({ title: el.title, option: el.optionA });

                        } else if (optionBCheck) {

                            this.userPollRes.push({ title: el.title, option: el.optionB });
                        }
                    });

                    this.obtained = '';
                    // this.obtainedUpdate = true;
                    this.obtainedDel = true;

                }).catch(err => {
                    console.log(err);
                });
        },
        confirmDel(userId) {
            Swal.fire({
                title: 'DELETE USER?',
                text: 'Are you sure you want to delete this User?',
                icon: 'warning',
                iconColor: 'red',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!',
            }).then((res) => {
                if (res.isConfirmed) {
                    this.obtainDelId(userId);
                }
            });
        },
        obtainDelId(userId) {
            let deleteUser = {
                userId: userId
            }
            axios.patch(appURL + "/deleteUser", deleteUser)
                .then(res => {
                    // if(res.data.success){
                    //     let idOfUserDeleted = this.allUsers.indexOf(userId);
                    //     this.allUsers.splice(idOfUserDeleted, 1);
                    // }
                    //TODO: add any sweet thing here...
                    Swal.fire({
                        icon: 'success',
                        title: 'User has been deleted from this poll.',
                        showConfirmButton: false,
                        timer: 3000
                    });
                    this.restoreUser(userId);

                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                }).catch(err => {
                    console.log(err);
                });
        },
        restoreUser() {
            // console.log(userId);
            axios.get(appURL + "/restoreUser")
                .then(res => {

                    this.obtainedUser = res.data.restore;
                    this.restoredUserLengthResult = res.data.restore.length;

                }).catch(err => {
                    console.log(err);
                });
        },
        restoredUser(userIdToRestore) {
            // console.log(userIdToRestore);
            let userToRestore = {
                userId: userIdToRestore
            }
            axios.patch(appURL + "/restoredUser", userToRestore)
                .then(res => {
                    // console.log(res);
                    const Toast = Swal.mixin({
                        toast: true,
                        position: 'top-end',
                        showConfirmButton: false,
                        timer: 3000,
                        timerProgressBar: true,
                        didOpen: (toast) => {
                            toast.addEventListener('mouseenter', Swal.stopTimer)
                            toast.addEventListener('mouseleave', Swal.resumeTimer)
                        }
                    })
                    Toast.fire({
                        icon: 'success',
                        title: 'User Restored successfully!'
                    })

                    setTimeout(() => {
                        location.reload();
                    }, 3000);

                }).catch(err => {

                    console.log(err);
                });
        },

        onFileChange(e) {
            // var uploadImg = e.target.files || e.dataTransfer.files;
            // console.log(files);
            // if (!files.length)
            //     return;
            // this.createImage(files[0]);
            // this.image = e.target.files[0]
            this.uploadImg = this.$refs.uploadImg.files[0];
            
        },
        // createImage(uploadImg) {
        //     var uploadImg = new Image();
        //     console.log(uploadImg);

        //     var reader = new FileReader();
        //     console.log(reader);
        //     var vm = this;

        //     reader.onload = (e) => {
        //         vm.uploadImg = e.target.result;
        //         // console.log(vm.image);
                             
        //     };
         
            // reader.readAsDataURL(uploadImg);
            //  myImg = file.name;
            
            // console.log(myImg);
            // console.log(file.name);
            // console.log(file);
            // formData.append('image', file);

        // },
        // removeImage: function (e) {
        //     this.image = '';
        // },

        updateUserProfile(){
            let userId = JSON.parse(window.localStorage.getItem('updateUserProfile'));
    
            // var uploaded = this.myImg;

            // console.log(myImg)
            // let updateUser = {
            //     userId: userId,
            //     upUserFname: this.upUserFname,
            //     upUserLName: this.upUserLName,
            //     upUserEmail: this.upUserEmail,
            //     upUserPhone: this.upUserPhone,
            //     uploadImg: this.image.name,
            

            // } 
            // console.log(updateUser);
            
            
            //  var fd = new FormData();
            //  fd.append('image', this.image, this.image.name);
            //  console.log(this.image);
            //  console.log(fd);

            var updateUser = new FormData();
            updateUser.append('userId', userId);
            updateUser.append('upUserFname', this.upUserFname);
            updateUser.append('upUserLName', this.upUserLName);
            updateUser.append('upUserEmail', this.upUserEmail);
            updateUser.append('upUserPhone', this.upUserPhone);
            updateUser.append('uploadImg', this.uploadImg);

            console.log(this.uploadImg);
            this.upUserFname = [],
            this.upUserLName = [],
            this.upUserEmail = [],
            this.upUserPhone = [],
            this.uploadImg = []



            axios.post(appURL+"/updateUser", updateUser)
            .then(res =>{
                console.log(res);
            }).then(res => {
                // console.log(res);
                Swal.fire({
                    icon: 'success',
                    title: 'Profile Updated Successfully!',
                    text: 'Login next time with your new email.',
                    showConfirmButton: false,
                    timer: 3000
                });        
                $('#updateUserModal').modal('close');

            }).catch(err => {
                Swal.fire({
                    icon: 'error',
                    title: 'Error Alert!',
                    text: 'Profile could not be updated Successfully. Please try again later.',
                    showConfirmButton: false,
                    timer: 3000
                });
                $('#updateUserModal').modal('close');
            });

        },
        
        getUserUpdatedProfile(){
            socket.on('connect', () => {
                console.log('gotten user Profile');
                console.log('i see you');

                socket.on('connected', (data) => {
                    console.log(data)
                });

                socket.on('userUpdRes', (data) => {
                    console.log(data);

                    window.localStorage.removeItem('user');

                    window.localStorage.setItem('user', JSON.stringify(data));

                 

                    this.userImgae = JSON.parse(window.localStorage.getItem('user'));
                    this.image = this.userImage.length;
                    console.log(this.image);
                    setTimeout(() => {
                        location.reload();
                    }, 3000);
                });
            });
        },
        checkbox(e) {
            let pollId = e.target.getAttribute('data-id');
            let toggle;
            if (e.target.checked == false) {
                toggle = false
            }
            else if (e.target.checked == true) {
                toggle = true
            }
            let activePoll = {
                pollId: pollId,
                toggle: toggle
            }
            axios.patch(appURL + "/activePoll", activePoll)
                .then(res => {
                    // console.log(e, toggle)
                }).catch(err => {

                    console.log(err);
                });
        },
        getSocketToggleButton() {
            socket.on("connect", () => {
                console.log('Grabbed toggle button');

                socket.on('connected', (data) => {
                    console.log(data);
                });

                socket.on('toggle', (datum) => {
                    this.polls.forEach(el => {
                        if (datum._id === el._id) {
                            // console.log(datum.toggle);
                            el.toggle = datum.toggle;
                        }
                    });
                });
            });
        },
        logout() {
            window.localStorage.removeItem('user');
            this.user = [];

            window.localStorage.removeItem('admin');
            this.adminCheck = [];

            window.localStorage.removeItem('gender');
            this.checkGender = [];

            window.localStorage.removeItem('updateUserProfile');

            window.location.href = "./index.html";
        },
        showModal() {
            $('#modal1').modal('open');
        }
    }
});