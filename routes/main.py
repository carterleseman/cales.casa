from flask import Blueprint, render_template, redirect, url_for

main = Blueprint('main', __name__)

@main.route('/')
def index():
    return redirect(url_for('main.server'))

@main.route('/server')
def server():
    return render_template('server.html')