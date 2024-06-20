{
    'name': 'CRUD Employee',
    'version': '16.0',
    'summary': '"""""""',
    'description': '',

    'author': "janvi",

    'depends': ['base','website'],

    'data': [
        'security/ir.model.access.csv',
        'view/employees_website.xml',

    ],

    'assets': {
        'web.assets_frontend': [
            'crud_employee/static/src/js/employee_detail.js',
            'crud_employee/static/src/css/employee_style.css',
        ],
    },

    'installable': True,
    'auto-install': False,
    'application': True,
}
