"""Setup for learning_path XBlock."""

import os
from setuptools import setup


def package_data(pkg, roots):
    """Generic function to find package_data.

    All of the files under each of the `roots` will be declared as package
    data for package `pkg`.

    """
    data = []
    for root in roots:
        for dirname, _, files in os.walk(os.path.join(pkg, root)):
            for fname in files:
                data.append(os.path.relpath(os.path.join(dirname, fname), pkg))

    return {pkg: data}


setup(
    name='xblock-learning_path',
    version='0.729',
    description='An Xblock to guide students through a course with adaptive learning path',
    packages=[
        'learning_path',
    ],
    install_requires=[
        'XBlock',
    ],
    entry_points={
        'xblock.v1': [
            'question = learning_path:QuestionBlock',
            'link = learning_path:LinkBlock'
        ]
    },
    package_data=package_data("learning_path", ["static", "public"]),
)
