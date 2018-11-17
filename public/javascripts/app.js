$(document).ready(function() {
    triggerFlashMessage()
})

function triggerFlashMessage() {
    if (document.getElementById('flash-message')) {
        var message = document.getElementById('flash-message').dataset.message
        var type = document.getElementById('flash-message').dataset.type
        M.toast({
            html: `<i class="material-icons">${
                type == 'success' ? 'check' : 'clear'
            }</i>${message}`,
            classes: `${type == 'success' ? 'teal accent-3' : 'red accent-3'}`
        })
    }
}
