$.get('/list', function(data, err) {
    for(var i = 0; i < data.length; i++){
        $('#vidList').append(`<div class="vid" id="vid-${i}">${data[i]}</div>`)
    }
}).then(()=>{
    $('.vid').on('click', function() {

        $('.vidContainer').hide()

        $(`#vidPlayer-${$(this).attr('id').split('-')[1]}`).show()

        // $.ajax({
        //     type: 'POST',
        //     url: url,
            // dataType: 'json',
            // contentType: 'application/json',
            // data: JSON.stringify({title: $(this).text()})
    //     })
    })
})