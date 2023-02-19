M.AutoInit();

// Registry Submit Button Section
$('#regBtn').on('click', () => {
    // e.preventDefault();

    let err = 0;

    var regPass = $('input[name="regPass"]').val();
    var cRegPass = $('input[name="cRegPass"]').val();
    console.log(regPass, cRegPass);

    if(regPass !== cRegPass){
        err = 1;
        Swal.fire({
            icon: 'error',
            title: 'Passwords does not match!',
            text: 'Check your passwords and try again.',
            showConfirmButton: false,
            timer: 3000
        });
        console.log('Passwords does not match!');
    } else {
        err;
        Swal.fire({
            icon: 'success',
            title: 'User Registered Successfully!',
            text: 'You can Login now.',
            showConfirmButton: false,
            timer: 3000
        });
        $('#regDiv').addClass('hide');
        $('#logDiv').removeClass('hide');
    }
});

// Forms Toggle Btns
$('#logSwapBtn').on('click', () => {
    $('#logDiv').addClass('hide');
    $('#regDiv').removeClass('hide');
});

$('#regSwapBtn').on('click', () => {
    $('#regDiv').addClass('hide');
    $('#logDiv').removeClass('hide');
});

// $('#checkbok').prop('checked', () => {
//     console.log('on');
// })
    
$('#checkbox').on('change', function(){
    if($(this).prop('checked') == true){//on
        alert('on');
        // private
    } else if($(this).prop('checked') == false){//off
        alert('off');
        // public
    }
});
