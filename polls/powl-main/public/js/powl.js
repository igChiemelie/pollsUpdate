M.AutoInit();

$('.dropdown-trigger').dropdown({
    coverTrigger: false
});

// Login Swap Div
$('#logSwapBtn').on('click', () => {
    $('.loginContainDiv').addClass('hide');
    $('.regContainDiv').removeClass('hide');
});
// Registry Swap Div
$('#regSwapBtn').on('click', () => {
    $('.loginContainDiv').removeClass('hide');
    $('.regContainDiv').addClass('hide');
});
    
$('.testBtn').on('click', (e) => {
    e.preventDefault();
    let userId = $('#userId').val();
    console.log(userId + ' options');

    $.ajax({
        type: 'PATCH',
        url: '/polls/poll/:id',
        cache: false,
        data: {userId: userId},
        success: (result) => {
            console.log('success!');
        },
        error: () => {
            console.log('Error here');
        }
    });
});
        
 




