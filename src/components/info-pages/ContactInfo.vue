<template>
    <div class="card mt-5 w-9 contact-info border-round shadow-2">
        <div class="flex flex-column card-container green-container">
            <div class="flex flex-wrap card-container">
                <p class="contact-info-title">Contact Info:</p>
            </div>
            <div class="flex flex-wrap card-container">
                <p class="contact-info-entry">
                    For any questions or concerns send an email to <a href = "mailto: pjmoat620@gmail.com">pjmoat620@gmail.com</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style>
    .contact-info-title {
        font-size: 20px;
        font-weight: bold;
        padding-left: 0.5rem;
        margin-top: 0.5rem;
        margin-bottom: 0;
        color:white;
    }

    .contact-info-entry {
        padding-left: 3rem;
        margin-top: 0.5rem;
        margin-bottom: 0.5rem;
        color: white;
    }

    .contact-info {
        margin: auto;
        width: 50%;
        padding-bottom: 4rem;
        background: var(--color-primary);
    }
</style>
