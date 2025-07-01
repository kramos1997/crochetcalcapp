document.addEventListener('DOMContentLoaded', function() {
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.getAttribute('data-tab');
            
            // Remove active class from all buttons and contents
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and corresponding content
            btn.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Materials management
    let materialCount = 1;
    const materialsContainer = document.getElementById('materials-container');
    const addMaterialBtn = document.getElementById('add-material');
    
    addMaterialBtn.addEventListener('click', () => {
        materialCount++;
        const materialItem = document.createElement('div');
        materialItem.className = 'material-item';
        materialItem.innerHTML = `
            <div class="form-group">
                <label for="material-name-${materialCount}">Material Name</label>
                <input type="text" id="material-name-${materialCount}" placeholder="e.g., Yarn">
            </div>
            <div class="form-group">
                <label for="material-cost-${materialCount}">Cost ($)</label>
                <input type="number" id="material-cost-${materialCount}" min="0" step="0.01" placeholder="0.00">
            </div>
            <button type="button" class="remove-btn">Remove</button>
        `;
        materialsContainer.appendChild(materialItem);
        
        // Add event listener to the new remove button
        const removeBtn = materialItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            materialItem.remove();
        });
    });
    
    // Expenses management
    let expenseCount = 1;
    const expensesContainer = document.getElementById('expenses-container');
    const addExpenseBtn = document.getElementById('add-expense');
    
    addExpenseBtn.addEventListener('click', () => {
        expenseCount++;
        const expenseItem = document.createElement('div');
        expenseItem.className = 'expense-item';
        expenseItem.innerHTML = `
            <div class="form-group">
                <label for="expense-name-${expenseCount}">Expense Name</label>
                <input type="text" id="expense-name-${expenseCount}" placeholder="e.g., Tools">
            </div>
            <div class="form-group">
                <label for="expense-cost-${expenseCount}">Cost ($)</label>
                <input type="number" id="expense-cost-${expenseCount}" min="0" step="0.01" placeholder="0.00">
            </div>
            <button type="button" class="remove-btn">Remove</button>
        `;
        expensesContainer.appendChild(expenseItem);
        
        // Add event listener to the new remove button
        const removeBtn = expenseItem.querySelector('.remove-btn');
        removeBtn.addEventListener('click', () => {
            expenseItem.remove();
        });
    });
    
    // Calculate price
    const calculateBtn = document.getElementById('calculate-btn');
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    
    calculateBtn.addEventListener('click', calculatePrice);
    resetBtn.addEventListener('click', resetForm);
    saveBtn.addEventListener('click', saveProject);
    
    function calculatePrice() {
        // Get all material costs
        const materialItems = document.querySelectorAll('.material-item');
        let materialsCost = 0;
        
        materialItems.forEach(item => {
            const costInput = item.querySelector('input[id^="material-cost-"]');
            const cost = parseFloat(costInput.value) || 0;
            materialsCost += cost;
        });
        
        // Get labor cost
        const hourlyRate = parseFloat(document.getElementById('hourly-rate').value) || 0;
        const hoursSpent = parseFloat(document.getElementById('hours-spent').value) || 0;
        const laborCost = hourlyRate * hoursSpent;
        
        // Get business expenses
        const expenseItems = document.querySelectorAll('.expense-item');
        let businessExpenses = 0;
        
        expenseItems.forEach(item => {
            const costInput = item.querySelector('input[id^="expense-cost-"]');
            const cost = parseFloat(costInput.value) || 0;
            businessExpenses += cost;
        });
        
        // Get additional factors
        const profitMargin = parseFloat(document.getElementById('profit-margin').value) || 0;
        const shippingCost = parseFloat(document.getElementById('shipping-cost').value) || 0;
        const taxRate = parseFloat(document.getElementById('tax-rate').value) || 0;
        
        // Calculate base cost
        const baseCost = materialsCost + laborCost + businessExpenses;
        
        // Calculate profit amount
        const profitAmount = baseCost * (profitMargin / 100);
        
        // Calculate tax amount
        const taxAmount = baseCost * (taxRate / 100);
        
        // Calculate wholesale price
        const wholesalePrice = baseCost + profitAmount + shippingCost + taxAmount;
        
        // Calculate retail price (2x wholesale)
        const retailPrice = wholesalePrice * 2;
        
        // Update results
        document.getElementById('materials-cost').textContent = formatCurrency(materialsCost);
        document.getElementById('labor-cost').textContent = formatCurrency(laborCost);
        document.getElementById('business-expenses').textContent = formatCurrency(businessExpenses);
        document.getElementById('base-cost').textContent = formatCurrency(baseCost);
        document.getElementById('profit-amount').textContent = formatCurrency(profitAmount);
        document.getElementById('shipping-amount').textContent = formatCurrency(shippingCost);
        document.getElementById('tax-amount').textContent = formatCurrency(taxAmount);
        document.getElementById('wholesale-price').textContent = formatCurrency(wholesalePrice);
        document.getElementById('retail-price').textContent = formatCurrency(retailPrice);
        
        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
    
    function resetForm() {
        // Reset materials (keep the first one)
        const materialItems = document.querySelectorAll('.material-item');
        for (let i = 1; i < materialItems.length; i++) {
            materialItems[i].remove();
        }
        document.getElementById('material-name-1').value = '';
        document.getElementById('material-cost-1').value = '';
        
        // Reset expenses (keep the first one)
        const expenseItems = document.querySelectorAll('.expense-item');
        for (let i = 1; i < expenseItems.length; i++) {
            expenseItems[i].remove();
        }
        document.getElementById('expense-name-1').value = '';
        document.getElementById('expense-cost-1').value = '';
        
        // Reset other fields
        document.getElementById('hourly-rate').value = '';
        document.getElementById('hours-spent').value = '';
        document.getElementById('profit-margin').value = '';
        document.getElementById('shipping-cost').value = '';
        document.getElementById('tax-rate').value = '';
        
        // Reset results
        document.getElementById('materials-cost').textContent = '$0.00';
        document.getElementById('labor-cost').textContent = '$0.00';
        document.getElementById('business-expenses').textContent = '$0.00';
        document.getElementById('base-cost').textContent = '$0.00';
        document.getElementById('profit-amount').textContent = '$0.00';
        document.getElementById('shipping-amount').textContent = '$0.00';
        document.getElementById('tax-amount').textContent = '$0.00';
        document.getElementById('wholesale-price').textContent = '$0.00';
        document.getElementById('retail-price').textContent = '$0.00';
        
        // Reset counters
        materialCount = 1;
        expenseCount = 1;
    }
    
    function saveProject() {
        // Get project name
        const projectName = prompt('Enter a name for this project:');
        if (!projectName) return;
        
        // Get current values
        const wholesalePrice = document.getElementById('wholesale-price').textContent;
        const retailPrice = document.getElementById('retail-price').textContent;
        
        // Get all form data
        const formData = {
            name: projectName,
            materials: [],
            hourlyRate: document.getElementById('hourly-rate').value,
            hoursSpent: document.getElementById('hours-spent').value,
            expenses: [],
            profitMargin: document.getElementById('profit-margin').value,
            shippingCost: document.getElementById('shipping-cost').value,
            taxRate: document.getElementById('tax-rate').value,
            wholesalePrice: wholesalePrice,
            retailPrice: retailPrice,
            date: new Date().toLocaleDateString()
        };
        
        // Get materials
        const materialItems = document.querySelectorAll('.material-item');
        materialItems.forEach(item => {
            const nameInput = item.querySelector('input[id^="material-name-"]');
            const costInput = item.querySelector('input[id^="material-cost-"]');
            
            if (nameInput.value || costInput.value) {
                formData.materials.push({
                    name: nameInput.value,
                    cost: costInput.value
                });
            }
        });
        
        // Get expenses
        const expenseItems = document.querySelectorAll('.expense-item');
        expenseItems.forEach(item => {
            const nameInput = item.querySelector('input[id^="expense-name-"]');
            const costInput = item.querySelector('input[id^="expense-cost-"]');
            
            if (nameInput.value || costInput.value) {
                formData.expenses.push({
                    name: nameInput.value,
                    cost: costInput.value
                });
            }
        });
        
        // Save to local storage
        let savedProjects = JSON.parse(localStorage.getItem('crochetProjects')) || [];
        savedProjects.push(formData);
        localStorage.setItem('crochetProjects', JSON.stringify(savedProjects));
        
        // Update projects list
        updateProjectsList();
        
        alert('Project saved successfully!');
    }
    
    function updateProjectsList() {
        const projectsList = document.getElementById('projects-list');
        const savedProjects = JSON.parse(localStorage.getItem('crochetProjects')) || [];
        
        if (savedProjects.length === 0) {
            projectsList.innerHTML = '<p class="no-projects">No saved projects yet.</p>';
            return;
        }
        
        projectsList.innerHTML = '';
        
        savedProjects.forEach((project, index) => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.innerHTML = `
                <div class="project-info">
                    <h3>${project.name}</h3>
                    <p>Created: ${project.date}</p>
                </div>
                <div class="project-price">
                    ${project.retailPrice}
                </div>
                <div class="project-actions">
                    <button type="button" class="load-project" data-index="${index}">Load</button>
                    <button type="button" class="delete-project" data-index="${index}">Delete</button>
                </div>
            `;
            projectsList.appendChild(projectCard);
        });
        
        // Add event listeners to load and delete buttons
        document.querySelectorAll('.load-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                loadProject(index);
            });
        });
        
        document.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteProject(index);
            });
        });
    }
    
    function loadProject(index) {
        const savedProjects = JSON.parse(localStorage.getItem('crochetProjects')) || [];
        const project = savedProjects[index];
        
        if (!project) return;
        
        // Reset form first
        resetForm();
        
        // Load materials
        project.materials.forEach((material, i) => {
            if (i === 0) {
                // First material item already exists
                document.getElementById('material-name-1').value = material.name;
                document.getElementById('material-cost-1').value = material.cost;
            } else {
                // Add new material items
                addMaterialBtn.click();
                const newIndex = i + 1;
                document.getElementById(`material-name-${newIndex}`).value = material.name;
                document.getElementById(`material-cost-${newIndex}`).value = material.cost;
            }
        });
        
        // Load expenses
        project.expenses.forEach((expense, i) => {
            if (i === 0) {
                // First expense item already exists
                document.getElementById('expense-name-1').value = expense.name;
                document.getElementById('expense-cost-1').value = expense.cost;
            } else {
                // Add new expense items
                addExpenseBtn.click();
                const newIndex = i + 1;
                document.getElementById(`expense-name-${newIndex}`).value = expense.name;
                document.getElementById(`expense-cost-${newIndex}`).value = expense.cost;
            }
        });
        
        // Load other fields
        document.getElementById('hourly-rate').value = project.hourlyRate;
        document.getElementById('hours-spent').value = project.hoursSpent;
        document.getElementById('profit-margin').value = project.profitMargin;
        document.getElementById('shipping-cost').value = project.shippingCost;
        document.getElementById('tax-rate').value = project.taxRate;
        
        // Calculate price
        calculatePrice();
        
        alert(`Project "${project.name}" loaded successfully!`);
    }
    
    function deleteProject(index) {
        if (!confirm('Are you sure you want to delete this project?')) return;
        
        const savedProjects = JSON.parse(localStorage.getItem('crochetProjects')) || [];
        savedProjects.splice(index, 1);
        localStorage.setItem('crochetProjects', JSON.stringify(savedProjects));
        
        updateProjectsList();
        
        alert('Project deleted successfully!');
    }
    
    // Notion embed
    const embedNotionBtn = document.getElementById('embed-notion');
    const notionUrlInput = document.getElementById('notion-url');
    const notionEmbed = document.getElementById('notion-embed');
    
    embedNotionBtn.addEventListener('click', () => {
        const notionUrl = notionUrlInput.value.trim();
        
        if (!notionUrl) {
            alert('Please enter a valid Notion URL');
            return;
        }
        
        // Create iframe for Notion embed
        notionEmbed.innerHTML = `<iframe src="${notionUrl}" allowfullscreen></iframe>`;
        
        // Save Notion URL to local storage
        localStorage.setItem('notionEmbedUrl', notionUrl);
    });
    
    // Load saved Notion URL if exists
    const savedNotionUrl = localStorage.getItem('notionEmbedUrl');
    if (savedNotionUrl) {
        notionUrlInput.value = savedNotionUrl;
        notionEmbed.innerHTML = `<iframe src="${savedNotionUrl}" allowfullscreen></iframe>`;
    }
    
    // Help modal
    const helpLink = document.getElementById('help-link');
    const helpModal = document.getElementById('help-modal');
    const closeModal = document.querySelector('.close-modal');
    
    helpLink.addEventListener('click', (e) => {
        e.preventDefault();
        helpModal.style.display = 'block';
    });
    
    closeModal.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === helpModal) {
            helpModal.style.display = 'none';
        }
    });
    
    // Load saved projects on page load
    updateProjectsList();
    
    // Helper function to format currency
    function formatCurrency(amount) {
        return '$' + amount.toFixed(2);
    }
});

