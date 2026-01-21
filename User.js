    const categoryData = {
            labels: ['Food', 'Transport', 'Entertainment', 'Shopping'],
            percentages: [42, 33, 12, 10],
            colors: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6']
        };
        
       
        let currentColorblindTheme = 'normal';
        

        document.addEventListener('DOMContentLoaded', function() {
            
            initializeCategoryChart();
            
            
            document.getElementById('saveProfile').addEventListener('click', function() {
                const userName = document.getElementById('userName').value;
                const userEmail = document.getElementById('userEmail').value;
                
                if (!userName.trim()) {
                    showMessage('Please enter your name', 'error');
                    return;
                }
                
                if (!userEmail.trim() || !isValidEmail(userEmail)) {
                    showMessage('Please enter a valid email address', 'error');
                    return;
                }
                
               
                document.getElementById('currentUserName').textContent = userName;
                
                
                localStorage.setItem('userProfile', JSON.stringify({
                    name: userName,
                    email: userEmail
                }));
                
                showMessage('Profile saved successfully!', 'success');
            });
            
            
            const savedProfile = localStorage.getItem('userProfile');
            if (savedProfile) {
                const profile = JSON.parse(savedProfile);
                document.getElementById('userName').value = profile.name;
                document.getElementById('userEmail').value = profile.email;
                document.getElementById('currentUserName').textContent = profile.name;
            }
            
            
            const themeOptions = document.querySelectorAll('.theme-option');
            themeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const theme = this.getAttribute('data-theme');
                    
                   
                    themeOptions.forEach(opt => {
                        opt.querySelector('.fa-check').classList.add('hidden');
                        opt.classList.remove('bg-blue-50', 'border-blue-300');
                    });
                    
                    this.querySelector('.fa-check').classList.remove('hidden');
                    this.classList.add('bg-blue-50', 'border-blue-300');
                    
                    
                    document.body.classList.remove('theme-light', 'theme-dark');
                    
                    
                    document.body.classList.add(`theme-${theme}`);
                    
                    
                    document.getElementById('currentThemeDisplay').textContent = 
                        theme === 'light' ? 'Light Mode' : 'Dark Mode';
                    
                 
                    updateTextColorsForTheme(theme);
                    
                    showMessage(`Theme changed to ${theme === 'light' ? 'Light Mode' : 'Dark Mode'} successfully!`, 'success');
                });
            });
            
           
            const colorblindOptions = document.querySelectorAll('.colorblind-option');
            colorblindOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const colorblindType = this.getAttribute('data-colorblind');
                    currentColorblindTheme = colorblindType;
                    
                   
                    colorblindOptions.forEach(opt => {
                        opt.querySelector('.fa-check').classList.add('hidden');
                        opt.classList.remove('bg-blue-50', 'border-blue-300', 'bg-green-50', 'bg-yellow-50');
                    });
                    
                    this.querySelector('.fa-check').classList.remove('hidden');
                    
                    
                    if (colorblindType === 'normal') {
                        this.classList.add('bg-blue-50', 'border-blue-300');
                    } else if (colorblindType === 'protanopia') {
                        this.classList.add('bg-blue-50', 'border-blue-300');
                    } else if (colorblindType === 'deuteranopia') {
                        this.classList.add('bg-green-50', 'border-green-300');
                    } else if (colorblindType === 'tritanopia') {
                        this.classList.add('bg-yellow-50', 'border-yellow-300');
                    }
                    
                
                    document.body.classList.remove(
                        'theme-protanopia',
                        'theme-deuteranopia', 
                        'theme-tritanopia'
                    );
                    
                
                    if (colorblindType !== 'normal') {
                        document.body.classList.add(`theme-${colorblindType}`);
                    }
                    
                   
                    let displayName = 'Normal Vision';
                    if (colorblindType === 'protanopia') displayName = 'Protanopia';
                    else if (colorblindType === 'deuteranopia') displayName = 'Deuteranopia';
                    else if (colorblindType === 'tritanopia') displayName = 'Tritanopia';
                    
                    document.getElementById('currentColorblindDisplay').textContent = displayName;
                    
                    
                    updateThemeColors();
                    
                    showMessage(`Color accessibility mode changed to ${displayName}`, 'success');
                });
            });
            
         
            document.getElementById('resetTheme').addEventListener('click', function() {
                
                document.body.classList.remove(
                    'theme-dark', 
                    'theme-protanopia',
                    'theme-deuteranopia', 
                    'theme-tritanopia'
                );
                document.body.classList.add('theme-light');
                
           
                themeOptions.forEach(opt => {
                    opt.querySelector('.fa-check').classList.add('hidden');
                    opt.classList.remove('bg-blue-50', 'border-blue-300');
                    if (opt.getAttribute('data-theme') === 'light') {
                        opt.querySelector('.fa-check').classList.remove('hidden');
                        opt.classList.add('bg-blue-50', 'border-blue-300');
                    }
                });
                
                colorblindOptions.forEach(opt => {
                    opt.querySelector('.fa-check').classList.add('hidden');
                    opt.classList.remove('bg-blue-50', 'border-blue-300', 'bg-green-50', 'bg-yellow-50');
                    if (opt.getAttribute('data-colorblind') === 'normal') {
                        opt.querySelector('.fa-check').classList.remove('hidden');
                        opt.classList.add('bg-blue-50', 'border-blue-300');
                    }
                });
                
            
                document.getElementById('currentThemeDisplay').textContent = 'Light Mode';
                document.getElementById('currentColorblindDisplay').textContent = 'Normal Vision';
                
                currentColorblindTheme = 'normal';
                
            
                updateTextColorsForTheme('light');
                
               
                updateThemeColors();
                
                showMessage('Theme reset to default successfully!', 'success');
            });
            
       
            updateThemeColors();
        });
        
      
        function updateTextColorsForTheme(theme) {
            const isDarkMode = theme === 'dark';
            
         
            const headerTitle = document.querySelector('header h1');
            if (headerTitle) {
                headerTitle.classList.toggle('text-gray-800', !isDarkMode);
                headerTitle.classList.toggle('text-white', isDarkMode);
            }
            
            
            const navLinks = document.querySelectorAll('nav a');
            navLinks.forEach(link => {
                link.classList.toggle('text-gray-700', !isDarkMode);
                link.classList.toggle('text-gray-300', isDarkMode);
                link.classList.toggle('hover:text-blue-600', !isDarkMode);
                link.classList.toggle('hover:text-blue-400', isDarkMode);
            });
            
          
            const mainTitle = document.querySelector('main h2');
            if (mainTitle) {
                mainTitle.classList.toggle('text-gray-800', !isDarkMode);
                mainTitle.classList.toggle('text-white', isDarkMode);
            }
            
         
            const subtitle = document.querySelector('main p.mt-1');
            if (subtitle) {
                subtitle.classList.toggle('text-gray-600', !isDarkMode);
                subtitle.classList.toggle('text-gray-400', isDarkMode);
            }
        }
        
   
        function initializeCategoryChart() {
            const ctx = document.getElementById('categoryChart').getContext('2d');
            
            
            const total = categoryData.percentages.reduce((a, b) => a + b, 0);
            
           
            const categoryChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: categoryData.labels,
                    datasets: [{
                        data: categoryData.percentages,
                        backgroundColor: categoryData.colors,
                        borderColor: '#ffffff',
                        borderWidth: 2,
                        hoverOffset: 15
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: true,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.raw || 0;
                                    return `${label}: ${value}%`;
                                }
                            }
                        }
                    },
                    cutout: '65%'
                }
            });
        }
        
     
        function updateThemeColors() {
            
            document.body.style.display = 'none';
            document.body.offsetHeight; 
            document.body.style.display = '';
            
            const header = document.querySelector('header');
            const primaryButtons = document.querySelectorAll('.btn-primary');
        }
        
        function isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
        
        function showMessage(message, type = 'info') {
            const messageArea = document.getElementById('messageArea');
            const colors = {
                success: 'bg-green-100 border-green-400 text-green-700',
                error: 'bg-red-100 border-red-400 text-red-700',
                info: 'bg-blue-100 border-blue-400 text-blue-700',
                warning: 'bg-yellow-100 border-yellow-400 text-yellow-700'
            };
            
            if (document.body.classList.contains('theme-dark')) {
                colors.success = 'bg-green-900 border-green-700 text-green-200';
                colors.error = 'bg-red-900 border-red-700 text-red-200';
                colors.info = 'bg-blue-900 border-blue-700 text-blue-200';
                colors.warning = 'bg-yellow-900 border-yellow-700 text-yellow-200';
            }
            
            const messageEl = document.createElement('div');
            messageEl.className = `${colors[type]} border px-4 py-3 rounded-lg mb-4 flex justify-between items-center`;
            messageEl.innerHTML = `
                <div class="flex items-center">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'} mr-2"></i>
                    <span>${message}</span>
                </div>
                <button class="text-lg ${document.body.classList.contains('theme-dark') ? 'text-gray-300 hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}" onclick="this.parentElement.remove()">
                    &times;
                </button>
            `;
            
            messageArea.innerHTML = '';
            messageArea.appendChild(messageEl);
            
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 5000);
        }