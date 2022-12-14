context('Form', () => {
	before(() => {
		cy.login();
		cy.visit('/desk');
		cy.insert_doc('Report', {
			'report_name': 'Test ToDo Report',
			'ref_doctype': 'ToDo',
			'report_type': 'Query Report',
			'query': 'select * from tabToDo'
		}, true).as('doc');
	});

	it('add custom column in report', () => {
		cy.visit('/desk#query-report/Permitted Documents For User');

		cy.get('div[class="page-form flex"]', {timeout: 60000}).should('have.length', 1).then(()=>{
			cy.get('#page-query-report input[data-fieldname="user"]').as('input');
			cy.get('@input').focus().type('test@erpnext.com', { delay: 100 });

			cy.get('#page-query-report input[data-fieldname="doctype"]').as('input-test');
			cy.get('@input-test').focus().type('Role', { delay: 100 }).blur();

			cy.get('.datatable').should('exist');
			cy.get('button').contains('Menu').click({force: true});
			cy.get('.dropdown-menu li').contains('Add Column').click({force: true});
			cy.get('.modal-dialog').should('contain', 'Add Column');
			cy.get('select[data-fieldname="doctype"]').select("Role", {force: true});
			cy.get('select[data-fieldname="field"]').select("Role Name", {force: true});
			cy.get('select[data-fieldname="insert_after"]').select("Name", {force: true});
			cy.get('button').contains('Submit').click({force: true});
			cy.get('button').contains('Menu').click({force: true});
			cy.get('.dropdown-menu li').contains('Save').click({force: true});
			cy.get('.modal-dialog').should('contain', 'Save Report');

			cy.get('input[data-fieldname="report_name"]').type("Test Report", {delay: 100, force: true});
			cy.get('button').contains('Submit').click({timeout:1000, force: true});
		});
	});

	let save_report_and_open = (report, update_name) => {
		cy.get('button').contains('Menu').click({force: true});
		cy.get('.dropdown-menu li').contains('Save').click({force: true});
		cy.get('.modal-dialog').should('contain', 'Save Report');

		cy.get('input[data-fieldname="report_name"]').type(update_name, {delay: 100, force: true});
		cy.get('button').contains('Submit').click({timeout: 1000, force: true});

		cy.visit('/desk#query-report/'+report);
		cy.get('.datatable').should('exist');
	};

	it('test multi level query report', () => {
		cy.visit('/desk#query-report/Test ToDo Report');
		cy.get('.datatable').should('exist');

		save_report_and_open('Test ToDo Report 1', ' 1');
		save_report_and_open('Test ToDo Report 11', '1');
	});
});
