import re

def update_html():
    with open('index.html', 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Update Tailwind config
    old_tailwind = """                    colors: {
                        dark: '#050505',
                        brand: {
                            blue: '#38bdf8',
                            purple: '#c084fc',
                            indigo: '#818cf8'
                        }
                    },"""
    new_tailwind = """                    colors: {
                        dark: '#050505',
                        brand: {
                            brown: '#855325',
                            light: '#F4E8DB',
                            dark: '#4A2B12',
                            accent: '#C79A71'
                        },
                        surface: '#FDFBF7'
                    },"""
    html = html.replace(old_tailwind, new_tailwind)

    # 2. Body classes
    html = html.replace('bg-dark text-gray-200 font-sans antialiased selection:bg-brand-blue selection:text-black',
                        'bg-surface text-gray-900 font-sans antialiased selection:bg-brand-brown selection:text-white')

    # 3. Logo update
    old_logo = """<a href="#" class="font-display font-bold text-xl text-white tracking-wide flex items-center gap-2">
                <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-brand-blue to-brand-purple flex items-center justify-center text-black text-sm">B</div>
                Bombay Networking Circle
            </a>"""
    new_logo = """<a href="#" class="flex items-center gap-3 group">
                <img src="logo.png" alt="BNC Logo" class="w-12 h-12 object-contain mix-blend-multiply group-hover:scale-105 transition-transform" onerror="this.onerror=null; this.outerHTML='<div class=\\'w-12 h-12 rounded-full border-2 border-brand-brown flex items-center justify-center text-brand-brown\\'><i class=\\'ph ph-coffee text-2xl\\'></i></div>'">
                <span class="font-display font-bold text-xl text-gray-900 tracking-wide uppercase hidden sm:block">Bombay<br><span class="text-brand-brown text-sm">Networking Circle</span></span>
            </a>"""
    html = html.replace(old_logo, new_logo)

    # 4. Global replacements for light mode
    # Be careful not to replace text-white on dark backgrounds, but let's do safe targeted replaces
    
    # Text colors
    html = html.replace('text-white', 'text-gray-900')
    html = html.replace('text-gray-400', 'text-gray-600')
    html = html.replace('text-gray-300', 'text-gray-700')
    html = html.replace('text-gray-500', 'text-gray-500')
    
    # Backgrounds and borders
    html = html.replace('bg-black', 'bg-white')
    html = html.replace('bg-black/50', 'bg-brand-light/30')
    html = html.replace('bg-darker', 'bg-surface')
    html = html.replace('border-white/10', 'border-brand-brown/10')
    html = html.replace('border-white/5', 'border-brand-brown/5')
    html = html.replace('border-white/20', 'border-brand-brown/20')
    
    # Buttons
    html = html.replace('bg-white text-black', 'bg-brand-brown text-white')
    html = html.replace('hover:bg-gray-200', 'hover:bg-brand-dark')
    
    # Brand colors
    html = html.replace('from-brand-blue via-brand-indigo to-brand-purple', 'from-brand-brown via-brand-accent to-brand-dark')
    html = html.replace('from-brand-blue to-brand-purple', 'from-brand-brown to-brand-accent')
    html = html.replace('bg-brand-blue/20', 'bg-brand-brown/10')
    html = html.replace('bg-brand-purple/20', 'bg-brand-accent/10')
    html = html.replace('bg-brand-blue', 'bg-brand-brown')
    html = html.replace('text-brand-blue', 'text-brand-brown')
    html = html.replace('text-brand-purple', 'text-brand-accent')
    html = html.replace('text-brand-indigo', 'text-brand-dark')
    
    # Fix instances where text-gray-900 is on a dark image background (city cards, event cards)
    html = html.replace('<h3 class="text-3xl font-display font-bold text-gray-900 mb-1">Mumbai</h3>', '<h3 class="text-3xl font-display font-bold text-white mb-1">Mumbai</h3>')
    html = html.replace('<h3 class="text-2xl font-display font-bold text-gray-900 mb-1">Bangalore</h3>', '<h3 class="text-2xl font-display font-bold text-white mb-1">Bangalore</h3>')
    html = html.replace('<h3 class="text-2xl font-display font-bold text-gray-900 mb-1">Delhi NCR</h3>', '<h3 class="text-2xl font-display font-bold text-white mb-1">Delhi NCR</h3>')
    html = html.replace('<h3 class="text-xl font-display font-bold text-gray-900">Pune</h3>', '<h3 class="text-xl font-display font-bold text-white">Pune</h3>')
    html = html.replace('<h3 class="text-xl font-display font-bold text-gray-900">Hyderabad</h3>', '<h3 class="text-xl font-display font-bold text-white">Hyderabad</h3>')
    html = html.replace('<h3 class="text-2xl font-display font-bold text-gray-900">Ahmedabad</h3>', '<h3 class="text-2xl font-display font-bold text-white">Ahmedabad</h3>')
    
    html = html.replace('<p class="text-gray-700 text-sm">Flagship Chapter', '<p class="text-gray-200 text-sm">Flagship Chapter')
    html = html.replace('<p class="text-gray-700 text-sm">Active Community', '<p class="text-gray-200 text-sm">Active Community')
    html = html.replace('<p class="text-gray-700 text-sm">New Chapter', '<p class="text-gray-200 text-sm">New Chapter')
    
    # Footer and dark sections
    # Let's keep the footer dark for contrast
    html = html.replace('<footer class="py-12 border-t border-brand-brown/10 bg-white">', '<footer class="py-12 border-t border-brand-brown/10 bg-brand-dark">')
    
    with open('index.html', 'w', encoding='utf-8') as f:
        f.write(html)

def update_css():
    with open('styles.css', 'r', encoding='utf-8') as f:
        css = f.read()
        
    css = css.replace('background-color: #050505;', 'background-color: #FDFBF7;')
    css = css.replace('color: #e5e5e5;', 'color: #1a1a1a;')
    css = css.replace('background: #000;', 'background: #F4E8DB;')
    css = css.replace('background: #222;', 'background: #C79A71;')
    css = css.replace('background: #444;', 'background: #855325;')
    
    css = css.replace('background: rgba(20, 20, 20, 0.4);', 'background: rgba(255, 255, 255, 0.7);')
    css = css.replace('border: 1px solid rgba(255, 255, 255, 0.05);', 'border: 1px solid rgba(133, 83, 37, 0.1);')
    css = css.replace('background: rgba(5, 5, 5, 0.7);', 'background: rgba(253, 251, 247, 0.85);')
    
    css = css.replace('rgba(56, 189, 248, 0.1)', 'rgba(133, 83, 37, 0.1)')
    css = css.replace('rgba(56, 189, 248, 0.3)', 'rgba(133, 83, 37, 0.3)')
    
    css = css.replace('background: linear-gradient(to right, #ffffff, #a1a1aa);', 'background: linear-gradient(to right, #855325, #4A2B12);')
    
    with open('styles.css', 'w', encoding='utf-8') as f:
        f.write(css)

update_html()
update_css()
