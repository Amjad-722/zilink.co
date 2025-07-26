<script lang="ts">
    import { onMount } from 'svelte';

    let selectedLanguage = 'en';

    const languages = [
        { code: 'en', name: 'English', nativeName: 'English' },
        { code: 'zh-CN', name: 'Chinese (Simplified)', nativeName: '中文(简体)' },
        { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
        { code: 'es', name: 'Spanish', nativeName: 'Español' },
        { code: 'fr', name: 'French', nativeName: 'Français' },
        { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
        { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
        { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
        { code: 'ru', name: 'Russian', nativeName: 'Русский' },
        { code: 'ja', name: 'Japanese', nativeName: '日本語' },
        { code: 'de', name: 'German', nativeName: 'Deutsch' },
        { code: 'ko', name: 'Korean', nativeName: '한국어' },
        { code: 'it', name: 'Italian', nativeName: 'Italiano' },
        { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' },
        { code: 'ur', name: 'Urdu', nativeName: 'اردو' } 
    ];

    function selectLanguage(langCode: string) {
        selectedLanguage = langCode;

        if (window.google && window.google.translate) {
            const select = document.querySelector(
                '#google_translate_element select'
            ) as HTMLSelectElement;
            if (select) {
                select.value = langCode;
                select.dispatchEvent(new Event('change'));
            }
        }
    }

    onMount(() => {
        window.googleTranslateElementInit = function () {
            new window.google.translate.TranslateElement(
                {
                    pageLanguage: 'en',
                    includedLanguages: 'en,zh-CN,hi,es,fr,ar,bn,pt,ru,ja,de,ko,it,tr,ur' 
                },
                'google_translate_element'
            );
        };

        const script = document.createElement('script');
        script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.body.appendChild(script);
    });
</script>

<div class="notranslate space-y-4 text-neutral-600">
    <div class="flex items-center space-x-2">
        <h3 class="text-xl font-bold text-neutral-800">Choose a language</h3>
    </div>

    <div class="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
        {#each languages as language}
            <button
                on:click={() => selectLanguage(language.code)}
                class="rounded-lg p-3 text-left transition-all duration-200 hover:bg-neutral-50 {selectedLanguage ===
                language.code
                    ? 'border-2 border-neutral-300 bg-neutral-50'
                    : 'border-2 border-transparent'}"
            >
                <div class="text-sm font-medium text-neutral-700">
                    {language.nativeName}
                </div>
                <div class="mt-1 text-xs text-neutral-500">
                    {language.name}
                </div>
            </button>
        {/each}
    </div>

    <div id="google_translate_element" class="hidden"></div>
</div>